"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitEntry, castVote } from "@/app/actions/community";
import { ImageUploader } from "./ImageUploader";

export function EntryForm({ slug, lang, remaining }: { slug: string; lang: "ko" | "en"; remaining: number }) {
  const ko = lang === "ko";
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);

  if (remaining <= 0) {
    return <p className="text-sm muted">{ko ? "응모할 수 있는 작품 수를 모두 채웠습니다." : "You've reached the entry limit."}</p>;
  }

  return (
    <form
      key={key}
      className="grid gap-5"
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await submitEntry(slug, fd);
          if (!res.ok) return setError(res.error);
          setDone(true);
          setKey((k) => k + 1);
          router.refresh();
        })
      }
    >
      {done && <p className="rounded-xl p-3 text-sm bg-white/10">{ko ? "응모했습니다. 확인 후 전시됩니다." : "Entered. It will appear after review."}</p>}
      <ImageUploader bucket="contest" name="image_path" max={1} lang={lang} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="field"><label htmlFor="title" className="!text-white">{ko ? "작품명" : "Title"}</label><input id="title" name="title" required maxLength={120} className="input" /></div>
        <div className="field"><label htmlFor="author_name" className="!text-white">{ko ? "작가명" : "Name"}</label><input id="author_name" name="author_name" required maxLength={60} className="input" /></div>
      </div>
      <div className="field"><label htmlFor="location" className="!text-white">{ko ? "촬영지" : "Location"}</label><input id="location" name="location" maxLength={120} className="input" /></div>
      <div className="field"><label htmlFor="caption" className="!text-white">{ko ? "작품 설명" : "Caption"}</label><textarea id="caption" name="caption" maxLength={1500} rows={4} className="input" /></div>
      <label className="flex items-start gap-3 text-sm muted">
        <input type="checkbox" name="agree" required className="mt-1" />
        <span>{ko ? "직접 촬영한 사진이며, 다이브 저널이 콘테스트 전시·홍보에 작가명과 함께 사용하는 데 동의합니다." : "I shot this photo and allow Dive Journal to show it, credited, for the contest."}</span>
      </label>
      {error && <p className="text-sm text-[#ff9a8a]">{error}</p>}
      <button className="btn btn-lagoon justify-self-start" disabled={pending}>{pending ? (ko ? "응모하는 중…" : "Submitting…") : ko ? `응모하기 (남은 ${remaining}점)` : `Enter (${remaining} left)`}</button>
    </form>
  );
}

export function VoteButton({ slug, entryId, lang, voted, disabledReason }: { slug: string; entryId: string; lang: "ko" | "en"; voted: boolean; disabledReason?: string }) {
  const ko = lang === "ko";
  const router = useRouter();
  const [pending, start] = useTransition();
  if (disabledReason) return <span className="text-xs text-muted-foreground">{disabledReason}</span>;
  return (
    <button
      type="button"
      disabled={pending || voted}
      onClick={() =>
        start(async () => {
          const res = await castVote(slug, entryId);
          if (!res.ok) alert(res.error);
          router.refresh();
        })
      }
      className={`btn !h-9 !px-4 text-sm ${voted ? "btn-lagoon" : "btn-ghost"}`}
    >
      {voted ? (ko ? "내 선택 ✓" : "My pick ✓") : pending ? "…" : ko ? "이 작품에 투표" : "Vote"}
    </button>
  );
}
