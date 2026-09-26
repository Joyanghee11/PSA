"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminReviewArtwork, adminReviewEntry, adminSaveContest } from "@/app/actions/community";
import { ImageUploader } from "./ImageUploader";

export function ArtworkReview({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const act = (d: "approve" | "reject" | "hide") => {
    let reason: string | undefined;
    if (d === "reject") {
      reason = prompt("반려 사유(작가에게 보입니다)") ?? undefined;
      if (reason === undefined) return;
    }
    start(async () => {
      const r = await adminReviewArtwork(id, d, reason);
      if (!r.ok) alert(r.error);
      router.refresh();
    });
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {status !== "approved" && <button disabled={pending} onClick={() => act("approve")} className="btn btn-primary !h-9 !px-4 text-sm">승인</button>}
      {status !== "rejected" && <button disabled={pending} onClick={() => act("reject")} className="btn btn-ghost !h-9 !px-4 text-sm">반려</button>}
      {status !== "hidden" && <button disabled={pending} onClick={() => act("hide")} className="btn btn-ghost !h-9 !px-4 text-sm">숨김</button>}
    </div>
  );
}

export function EntryReview({ id, status, award }: { id: string; status: string; award: string | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (patch: Parameters<typeof adminReviewEntry>[1]) =>
    start(async () => {
      const r = await adminReviewEntry(id, patch);
      if (!r.ok) alert(r.error);
      router.refresh();
    });
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {status !== "approved" && <button disabled={pending} onClick={() => run({ status: "approved" })} className="btn btn-primary !h-8 !px-3 text-xs">전시</button>}
      {status !== "rejected" && <button disabled={pending} onClick={() => run({ status: "rejected" })} className="btn btn-ghost !h-8 !px-3 text-xs">제외</button>}
      <select
        disabled={pending}
        defaultValue={award ?? ""}
        onChange={(e) => run({ award: e.target.value || null })}
        className="input !h-8 !w-auto !text-xs !px-2"
        aria-label="수상"
      >
        <option value="">수상 없음</option>
        <option value="grand">대상</option>
        <option value="gold">금상</option>
        <option value="silver">은상</option>
        <option value="bronze">동상</option>
        <option value="honorable">가작</option>
      </select>
    </div>
  );
}

type ContestRow = {
  id?: string; slug?: string; title_ko?: string; title_en?: string | null; theme_ko?: string | null;
  description_ko?: string | null; description_en?: string | null; cover_path?: string | null; prize_ko?: string | null;
  submit_starts_at?: string; submit_ends_at?: string; vote_ends_at?: string; max_entries?: number; status?: string; results_public?: boolean;
};

/** ISO → datetime-local(KST) */
function toLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(Date.parse(iso) + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 16);
}

export function ContestForm({ contest }: { contest?: ContestRow }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const c = contest ?? {};
  return (
    <form
      className="grid gap-4"
      action={(fd) =>
        start(async () => {
          const r = await adminSaveContest(fd);
          setMsg(r.ok ? "저장했습니다." : r.error);
          if (r.ok) router.refresh();
        })
      }
    >
      {c.id && <input type="hidden" name="id" value={c.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="field"><label>주소(slug, 영문 소문자·숫자·-)</label><input name="slug" defaultValue={c.slug} required pattern="[a-z0-9-]{3,60}" className="input" placeholder="2026-autumn-blue" /></div>
        <div className="field"><label>1인 응모 수</label><input name="max_entries" defaultValue={c.max_entries ?? 3} inputMode="numeric" className="input" /></div>
        <div className="field"><label>제목(한국어)</label><input name="title_ko" defaultValue={c.title_ko} required className="input" /></div>
        <div className="field"><label>제목(영어)</label><input name="title_en" defaultValue={c.title_en ?? ""} className="input" /></div>
      </div>
      <div className="field"><label>주제</label><input name="theme_ko" defaultValue={c.theme_ko ?? ""} className="input" placeholder="예: 푸른 빛, 블루 아워" /></div>
      <div className="field"><label>설명(한국어)</label><textarea name="description_ko" defaultValue={c.description_ko ?? ""} rows={4} className="input" /></div>
      <div className="field"><label>설명(영어)</label><textarea name="description_en" defaultValue={c.description_en ?? ""} rows={3} className="input" /></div>
      <div className="field"><label>시상 내용</label><textarea name="prize_ko" defaultValue={c.prize_ko ?? ""} rows={3} className="input" placeholder={"대상 1명: …\n금상 2명: …"} /></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="field"><label>응모 시작(KST)</label><input type="datetime-local" name="submit_starts_at" defaultValue={toLocal(c.submit_starts_at)} required className="input" /></div>
        <div className="field"><label>응모 마감(KST)</label><input type="datetime-local" name="submit_ends_at" defaultValue={toLocal(c.submit_ends_at)} required className="input" /></div>
        <div className="field"><label>투표 마감(KST)</label><input type="datetime-local" name="vote_ends_at" defaultValue={toLocal(c.vote_ends_at)} required className="input" /></div>
      </div>
      <div className="field">
        <label>표지 사진 {c.cover_path ? "(새로 올리면 바뀝니다)" : ""}</label>
        <CoverField current={c.cover_path ?? ""} />
      </div>
      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="status" value="published" defaultChecked={c.status === "published"} /> 공개</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="results_public" defaultChecked={c.results_public} /> 결과(수상·득표) 공개</label>
      </div>
      <div className="flex items-center gap-4">
        <button className="btn btn-primary" disabled={pending}>{pending ? "저장 중…" : c.id ? "수정 저장" : "콘테스트 만들기"}</button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </form>
  );
}

/** 새로 올린 표지(cover_path_new)가 있으면 서버 액션이 그것을 쓰고, 없으면 기존 cover_path 를 유지한다 */
function CoverField({ current }: { current: string }) {
  return (
    <div className="grid gap-2">
      <ImageUploader bucket="contest" name="cover_path_new" max={1} lang="ko" admin />
      <input type="hidden" name="cover_path" value={current} />
    </div>
  );
}
