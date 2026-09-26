// 갤러리·콘테스트 공용 타입과 조회 함수 (서버 전용)
// 읽기는 사용자 세션(RLS)으로 한다. 공개된 것과 본인 것만 보인다.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export type ArtworkStatus = "pending" | "approved" | "rejected" | "sold" | "hidden";

export interface Artwork {
  id: string;
  user_id: string;
  artist_name: string;
  artist_bio: string | null;
  title: string;
  description: string | null;
  medium: string | null;
  width_cm: number | null;
  height_cm: number | null;
  depth_cm: number | null;
  edition: string | null;
  year: number | null;
  framing: string | null;
  location: string | null;
  shipping: string | null;
  price_krw: number | null;
  images: string[];
  status: ArtworkStatus;
  reject_reason: string | null;
  created_at: string;
  approved_at: string | null;
}

export interface Contest {
  id: string;
  slug: string;
  title_ko: string;
  title_en: string | null;
  theme_ko: string | null;
  description_ko: string | null;
  description_en: string | null;
  cover_path: string | null;
  submit_starts_at: string;
  submit_ends_at: string;
  vote_ends_at: string;
  max_entries: number;
  prize_ko: string | null;
  status: "draft" | "published";
  results_public: boolean;
}

export interface ContestEntry {
  id: string;
  contest_id: string;
  user_id: string;
  author_name: string;
  title: string;
  caption: string | null;
  location: string | null;
  image_path: string;
  status: "pending" | "approved" | "rejected";
  award: "grand" | "gold" | "silver" | "bronze" | "honorable" | null;
  created_at: string;
}

export type ContestPhase = "upcoming" | "submitting" | "voting" | "closed";

export function contestPhase(c: Pick<Contest, "submit_starts_at" | "submit_ends_at" | "vote_ends_at">, now = new Date()): ContestPhase {
  const t = now.getTime();
  if (t < Date.parse(c.submit_starts_at)) return "upcoming";
  if (t < Date.parse(c.submit_ends_at)) return "submitting";
  if (t < Date.parse(c.vote_ends_at)) return "voting";
  return "closed";
}

/** Storage 공개 URL. 버킷이 public 이라 서명이 필요 없다. */
export function publicUrl(bucket: "artworks" | "contest", path: string | null | undefined): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function formatKrw(n: number | null, lang: "ko" | "en"): string {
  if (n == null) return lang === "ko" ? "가격 문의" : "Price on request";
  return lang === "ko" ? `${n.toLocaleString("ko-KR")}원` : `₩${n.toLocaleString("en-US")}`;
}

export function formatSize(a: Pick<Artwork, "width_cm" | "height_cm" | "depth_cm">): string | null {
  if (!a.width_cm || !a.height_cm) return null;
  const parts = [a.width_cm, a.height_cm, a.depth_cm].filter((v): v is number => v != null).map((v) => Number(v).toString());
  return `${parts.join(" × ")} cm`;
}

export async function getSessionUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function listPublicArtworks(limit = 60): Promise<Artwork[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("artworks")
    .select("*")
    .in("status", ["approved", "sold"])
    .order("approved_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data as Artwork[] | null) ?? [];
}

export async function getArtwork(id: string): Promise<Artwork | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("artworks").select("*").eq("id", id).maybeSingle();
  return (data as Artwork | null) ?? null;
}

export async function listMyArtworks(userId: string): Promise<Artwork[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("artworks").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return (data as Artwork[] | null) ?? [];
}

export async function listPublishedContests(): Promise<Contest[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("contests").select("*").eq("status", "published").order("submit_starts_at", { ascending: false });
  return (data as Contest[] | null) ?? [];
}

export async function getContest(slug: string): Promise<Contest | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("contests").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return (data as Contest | null) ?? null;
}

export async function listEntries(contestId: string): Promise<ContestEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contest_entries")
    .select("*")
    .eq("contest_id", contestId)
    .order("created_at", { ascending: false });
  return (data as ContestEntry[] | null) ?? [];
}

export async function countPublicArtworks(): Promise<number> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return 0;
  const supabase = await createClient();
  const { count } = await supabase.from("artworks").select("id", { count: "exact", head: true }).eq("status", "approved");
  return count ?? 0;
}
