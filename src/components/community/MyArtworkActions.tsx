"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMyArtwork, markInquiryRead } from "@/app/actions/community";

export function MyArtworkActions({ id, status, approvedBefore, lang }: { id: string; status: string; approvedBefore: boolean; lang: "ko" | "en" }) {
  const ko = lang === "ko";
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (action: "sold" | "hide" | "relist" | "delete", confirmText?: string) => {
    if (confirmText && !confirm(confirmText)) return;
    start(async () => {
      const res = await updateMyArtwork(id, action);
      if (!res.ok) alert(res.error);
      router.refresh();
    });
  };
  return (
    <div className="flex flex-wrap gap-2">
      {status === "approved" && <button className="btn btn-ghost !h-9 !px-4 text-sm" disabled={pending} onClick={() => run("sold")}>{ko ? "판매 완료로" : "Mark sold"}</button>}
      {status === "approved" && <button className="btn btn-ghost !h-9 !px-4 text-sm" disabled={pending} onClick={() => run("hide")}>{ko ? "숨기기" : "Hide"}</button>}
      {(status === "hidden" || status === "sold") && approvedBefore && <button className="btn btn-ghost !h-9 !px-4 text-sm" disabled={pending} onClick={() => run("relist")}>{ko ? "다시 게시" : "Relist"}</button>}
      <button className="btn btn-ghost !h-9 !px-4 text-sm text-danger" disabled={pending} onClick={() => run("delete", ko ? "이 작품을 삭제할까요? 되돌릴 수 없습니다." : "Delete this work? This cannot be undone.")}>{ko ? "삭제" : "Delete"}</button>
    </div>
  );
}

export function MarkReadButton({ id, lang }: { id: string; lang: "ko" | "en" }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button className="text-xs text-accent-teal hover:underline" disabled={pending} onClick={() => start(async () => { await markInquiryRead(id); router.refresh(); })}>
      {lang === "ko" ? "확인함" : "Mark read"}
    </button>
  );
}
