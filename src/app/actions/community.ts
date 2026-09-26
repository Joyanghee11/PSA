"use server";

// 갤러리·콘테스트 쓰기 전용 서버 액션.
// 표에는 쓰기 RLS 정책이 없다. 여기서 로그인·소유자·기간을 확인한 뒤 service_role 로만 쓴다.
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser, contestPhase, type Contest } from "@/lib/community";
import { isAuthenticated as isAdminSession } from "@/lib/auth";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function str(fd: FormData, key: string, max: number, required = false): string | null {
  const v = String(fd.get(key) ?? "").trim();
  if (!v) {
    if (required) throw new Error(`${key} 항목을 입력해 주세요.`);
    return null;
  }
  if (v.length > max) throw new Error(`${key} 항목이 너무 깁니다(최대 ${max}자).`);
  return v;
}

function num(fd: FormData, key: string, { min = 0, max = 100000, int = false } = {}): number | null {
  const raw = String(fd.get(key) ?? "").replace(/[,\s원]/g, "").trim();
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < min || n > max || (int && !Number.isInteger(n))) throw new Error(`${key} 값이 올바르지 않습니다.`);
  return n;
}

function fail(e: unknown): ActionResult<never> {
  return { ok: false, error: e instanceof Error ? e.message : "처리하지 못했습니다. 잠시 뒤 다시 시도해 주세요." };
}

/** 본인 폴더(<uid>/) 아래 파일만 허용한다. 남의 경로를 끌어다 쓰는 것을 막는다. */
function ownPaths(paths: string[], uid: string): string[] {
  const clean = paths.map((p) => p.trim()).filter(Boolean);
  for (const p of clean) {
    if (!new RegExp(`^${uid}/[0-9a-f-]{36}\\.(jpg|png|webp)$`).test(p)) throw new Error("사진 경로가 올바르지 않습니다.");
  }
  return clean;
}

// ─── 업로드 ─────────────────────────────────────────────────────────────
export async function requestUpload(bucket: "artworks" | "contest", contentType: string, size: number): Promise<ActionResult<{ path: string; token: string }>> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "로그인이 필요합니다." };
    const ext = IMAGE_TYPES[contentType];
    if (!ext) return { ok: false, error: "JPG, PNG, WEBP 사진만 올릴 수 있습니다." };
    if (!(size > 0 && size <= 25 * 1024 * 1024)) return { ok: false, error: "사진 한 장은 25MB 이하여야 합니다." };
    const path = `${user.id}/${randomUUID()}.${ext}`;
    const { data, error } = await createAdminClient().storage.from(bucket).createSignedUploadUrl(path);
    if (error || !data) return { ok: false, error: "업로드를 준비하지 못했습니다." };
    return { ok: true, data: { path, token: data.token } };
  } catch (e) {
    return fail(e);
  }
}

// ─── 갤러리 ─────────────────────────────────────────────────────────────
export async function submitArtwork(fd: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "로그인이 필요합니다." };
    const images = ownPaths(String(fd.get("images") ?? "").split("\n"), user.id);
    if (images.length < 1 || images.length > 8) return { ok: false, error: "사진은 1장에서 8장까지 올릴 수 있습니다." };
    const row = {
      user_id: user.id,
      artist_name: str(fd, "artist_name", 60, true)!,
      artist_bio: str(fd, "artist_bio", 1000),
      title: str(fd, "title", 120, true)!,
      description: str(fd, "description", 5000),
      medium: str(fd, "medium", 120),
      width_cm: num(fd, "width_cm", { min: 0.1, max: 10000 }),
      height_cm: num(fd, "height_cm", { min: 0.1, max: 10000 }),
      depth_cm: num(fd, "depth_cm", { min: 0.1, max: 10000 }),
      edition: str(fd, "edition", 60),
      year: num(fd, "year", { min: 1900, max: 2100, int: true }),
      framing: str(fd, "framing", 200),
      location: str(fd, "location", 120),
      shipping: str(fd, "shipping", 300),
      price_krw: num(fd, "price_krw", { min: 0, max: 2_000_000_000, int: true }),
      images,
      status: "pending" as const,
    };
    const { data, error } = await createAdminClient().from("artworks").insert(row).select("id").single();
    if (error || !data) return { ok: false, error: "작품을 등록하지 못했습니다." };
    revalidatePath("/[lang]/gallery/mine", "page");
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return fail(e);
  }
}

/** 작가 본인: 판매 완료 표시, 숨김, 다시 게시(이미 승인됐던 작품만), 삭제 */
export async function updateMyArtwork(id: string, action: "sold" | "hide" | "relist" | "delete"): Promise<ActionResult> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "로그인이 필요합니다." };
    const admin = createAdminClient();
    const { data: art } = await admin.from("artworks").select("id, user_id, status, approved_at").eq("id", id).maybeSingle();
    if (!art || art.user_id !== user.id) return { ok: false, error: "본인 작품만 바꿀 수 있습니다." };
    if (action === "delete") {
      await admin.from("artworks").delete().eq("id", id);
    } else {
      let status: string;
      if (action === "sold") status = "sold";
      else if (action === "hide") status = "hidden";
      else {
        if (!art.approved_at) return { ok: false, error: "승인된 적 없는 작품은 다시 게시할 수 없습니다. 승인을 기다려 주세요." };
        status = "approved";
      }
      await admin.from("artworks").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    }
    revalidatePath("/[lang]/gallery", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function sendInquiry(artworkId: string, fd: FormData): Promise<ActionResult> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "로그인 후 문의할 수 있습니다." };
    const admin = createAdminClient();
    const { data: art } = await admin.from("artworks").select("id, user_id, status").eq("id", artworkId).maybeSingle();
    if (!art || art.status !== "approved") return { ok: false, error: "지금은 문의할 수 없는 작품입니다." };
    if (art.user_id === user.id) return { ok: false, error: "본인 작품에는 문의할 수 없습니다." };
    const message = str(fd, "message", 3000, true)!;
    if (message.length < 5) return { ok: false, error: "문의 내용을 조금 더 적어 주세요." };
    // 같은 작품에 하루 3건 넘게 보내지 못하게 한다(도배 방지)
    const since = new Date(Date.now() - 86400000).toISOString();
    const { count } = await admin.from("artwork_inquiries").select("id", { count: "exact", head: true }).eq("artwork_id", artworkId).eq("sender_id", user.id).gte("created_at", since);
    if ((count ?? 0) >= 3) return { ok: false, error: "같은 작품에는 하루 3건까지 문의할 수 있습니다." };
    const { error } = await admin.from("artwork_inquiries").insert({
      artwork_id: artworkId,
      sender_id: user.id,
      sender_name: str(fd, "sender_name", 60, true)!,
      sender_contact: str(fd, "sender_contact", 120, true)!,
      message,
    });
    if (error) return { ok: false, error: "문의를 보내지 못했습니다." };
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function markInquiryRead(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };
  const admin = createAdminClient();
  const { data } = await admin.from("artwork_inquiries").select("id, artworks!inner(user_id)").eq("id", id).maybeSingle();
  const owner = (data as { artworks?: { user_id: string } } | null)?.artworks?.user_id;
  if (owner !== user.id) return { ok: false, error: "본인 작품의 문의만 처리할 수 있습니다." };
  await admin.from("artwork_inquiries").update({ read_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/[lang]/gallery/mine", "page");
  return { ok: true };
}

// ─── 콘테스트 ───────────────────────────────────────────────────────────
async function loadContest(slug: string): Promise<Contest | null> {
  const { data } = await createAdminClient().from("contests").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return (data as Contest | null) ?? null;
}

export async function submitEntry(slug: string, fd: FormData): Promise<ActionResult> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "로그인 후 응모할 수 있습니다." };
    const contest = await loadContest(slug);
    if (!contest) return { ok: false, error: "콘테스트를 찾을 수 없습니다." };
    if (contestPhase(contest) !== "submitting") return { ok: false, error: "응모 기간이 아닙니다." };
    const [image] = ownPaths([String(fd.get("image_path") ?? "")], user.id);
    if (!image) return { ok: false, error: "사진을 올려 주세요." };
    const admin = createAdminClient();
    const { count } = await admin.from("contest_entries").select("id", { count: "exact", head: true }).eq("contest_id", contest.id).eq("user_id", user.id);
    if ((count ?? 0) >= contest.max_entries) return { ok: false, error: `한 사람당 ${contest.max_entries}점까지 응모할 수 있습니다.` };
    if (fd.get("agree") !== "on") return { ok: false, error: "응모 규정에 동의해 주세요." };
    const { error } = await admin.from("contest_entries").insert({
      contest_id: contest.id,
      user_id: user.id,
      author_name: str(fd, "author_name", 60, true)!,
      title: str(fd, "title", 120, true)!,
      caption: str(fd, "caption", 1500),
      location: str(fd, "location", 120),
      image_path: image,
    });
    if (error) return { ok: false, error: "응모하지 못했습니다." };
    revalidatePath(`/[lang]/contest/${slug}`, "page");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function castVote(slug: string, entryId: string): Promise<ActionResult> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "로그인 후 투표할 수 있습니다." };
    const contest = await loadContest(slug);
    if (!contest) return { ok: false, error: "콘테스트를 찾을 수 없습니다." };
    if (contestPhase(contest) !== "voting") return { ok: false, error: "투표 기간이 아닙니다." };
    const admin = createAdminClient();
    const { data: entry } = await admin.from("contest_entries").select("id, user_id, status, contest_id").eq("id", entryId).maybeSingle();
    if (!entry || entry.contest_id !== contest.id || entry.status !== "approved") return { ok: false, error: "투표할 수 없는 작품입니다." };
    if (entry.user_id === user.id) return { ok: false, error: "본인 응모작에는 투표할 수 없습니다." };
    // 콘테스트당 1인 1표. 다른 작품을 고르면 표가 옮겨간다.
    const { error } = await admin.from("contest_votes").upsert(
      { contest_id: contest.id, user_id: user.id, entry_id: entryId, created_at: new Date().toISOString() },
      { onConflict: "contest_id,user_id" },
    );
    if (error) return { ok: false, error: "투표하지 못했습니다." };
    revalidatePath(`/[lang]/contest/${slug}`, "page");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ─── 관리자(기존 /admin 비밀번호 세션) ─────────────────────────────────
async function requireAdmin() {
  if (!(await isAdminSession())) throw new Error("관리자만 할 수 있습니다.");
}

export async function adminReviewArtwork(id: string, decision: "approve" | "reject" | "hide", reason?: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const patch =
      decision === "approve"
        ? { status: "approved", approved_at: new Date().toISOString(), reject_reason: null }
        : decision === "reject"
          ? { status: "rejected", reject_reason: (reason ?? "").slice(0, 500) || null }
          : { status: "hidden" };
    const { error } = await createAdminClient().from("artworks").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/[lang]/gallery", "layout");
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function adminSaveContest(fd: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = String(fd.get("id") ?? "") || null;
    const iso = (k: string) => {
      const v = String(fd.get(k) ?? "");
      const t = Date.parse(v.length === 16 ? `${v}:00+09:00` : v); // datetime-local 은 KST 로 해석
      if (!Number.isFinite(t)) throw new Error(`${k} 날짜가 올바르지 않습니다.`);
      return new Date(t).toISOString();
    };
    const row = {
      slug: str(fd, "slug", 60, true)!.toLowerCase(),
      title_ko: str(fd, "title_ko", 120, true)!,
      title_en: str(fd, "title_en", 120),
      theme_ko: str(fd, "theme_ko", 200),
      description_ko: str(fd, "description_ko", 5000),
      description_en: str(fd, "description_en", 5000),
      cover_path: (() => {
        const v = str(fd, "cover_path_new", 300) ?? str(fd, "cover_path", 300);
        if (v && !/^covers\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(v)) throw new Error("표지 경로가 올바르지 않습니다.");
        return v;
      })(),
      prize_ko: str(fd, "prize_ko", 1000),
      submit_starts_at: iso("submit_starts_at"),
      submit_ends_at: iso("submit_ends_at"),
      vote_ends_at: iso("vote_ends_at"),
      max_entries: num(fd, "max_entries", { min: 1, max: 20, int: true }) ?? 3,
      status: fd.get("status") === "published" ? "published" : "draft",
      results_public: fd.get("results_public") === "on",
    };
    const admin = createAdminClient();
    const { error } = id ? await admin.from("contests").update(row).eq("id", id) : await admin.from("contests").insert(row);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/[lang]/contest", "layout");
    revalidatePath("/admin/contests");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function adminReviewEntry(id: string, patch: { status?: "approved" | "rejected" | "pending"; award?: string | null }): Promise<ActionResult> {
  try {
    await requireAdmin();
    const allowed = ["grand", "gold", "silver", "bronze", "honorable"];
    const update: Record<string, unknown> = {};
    if (patch.status) update.status = patch.status;
    if (patch.award !== undefined) update.award = patch.award && allowed.includes(patch.award) ? patch.award : null;
    const { error } = await createAdminClient().from("contest_entries").update(update).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/[lang]/contest", "layout");
    revalidatePath("/admin/contests");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** 관리자 콘테스트 표지 업로드용(관리자는 Supabase 로그인이 없으므로 별도 경로) */
export async function adminRequestCoverUpload(contentType: string): Promise<ActionResult<{ path: string; token: string }>> {
  try {
    await requireAdmin();
    const ext = IMAGE_TYPES[contentType];
    if (!ext) return { ok: false, error: "JPG, PNG, WEBP 만 올릴 수 있습니다." };
    const path = `covers/${randomUUID()}.${ext}`;
    const { data, error } = await createAdminClient().storage.from("contest").createSignedUploadUrl(path);
    if (error || !data) return { ok: false, error: "업로드를 준비하지 못했습니다." };
    return { ok: true, data: { path, token: data.token } };
  } catch (e) {
    return fail(e);
  }
}
