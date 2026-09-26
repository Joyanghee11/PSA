"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { sendInquiry } from "@/app/actions/community";

export function InquiryForm({ artworkId, lang, signedIn, disabledReason }: { artworkId: string; lang: "ko" | "en"; signedIn: boolean; disabledReason?: string | null }) {
  const ko = lang === "ko";
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (disabledReason) {
    return <p className="text-sm text-muted-foreground">{disabledReason}</p>;
  }
  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">{ko ? "구매 문의는 로그인 후 보낼 수 있습니다." : "Sign in to message the artist."}</p>
        <Link href={`/login?next=/${lang}/gallery/${artworkId}`} className="btn btn-primary mt-4">{ko ? "로그인하고 문의하기" : "Sign in to inquire"}</Link>
      </div>
    );
  }
  if (msg?.ok) {
    return (
      <div className="rounded-2xl p-6 bg-[color-mix(in_srgb,var(--accent-teal)_10%,transparent)]">
        <p className="font-subheadline text-headline">{ko ? "문의를 작가에게 전달했습니다" : "Message sent to the artist"}</p>
        <p className="text-sm text-muted-foreground mt-1">{ko ? "남기신 연락처로 작가가 직접 연락드립니다." : "The artist will reply to the contact you left."}</p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4"
      action={(fd) =>
        start(async () => {
          const res = await sendInquiry(artworkId, fd);
          setMsg(res.ok ? { ok: true, text: "" } : { ok: false, text: res.error });
        })
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="field">
          <label htmlFor="sender_name">{ko ? "이름" : "Name"}</label>
          <input id="sender_name" name="sender_name" required maxLength={60} className="input" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="sender_contact">{ko ? "답장 받을 연락처" : "Reply to"}</label>
          <input id="sender_contact" name="sender_contact" required maxLength={120} className="input" placeholder={ko ? "이메일 또는 전화번호" : "Email or phone"} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">{ko ? "문의 내용" : "Message"}</label>
        <textarea id="message" name="message" required minLength={5} maxLength={3000} className="input" placeholder={ko ? "원하시는 크기·액자·배송 지역 등을 적어 주세요." : "Size, framing, shipping destination…"} />
        <span className="hint">{ko ? "연락처는 이 작품의 작가에게만 전달됩니다." : "Your contact is shared only with this artist."}</span>
      </div>
      {msg && !msg.ok && <p className="text-danger text-sm">{msg.text}</p>}
      <button className="btn btn-primary justify-self-start" disabled={pending}>{pending ? (ko ? "보내는 중…" : "Sending…") : ko ? "작가에게 문의 보내기" : "Send to artist"}</button>
    </form>
  );
}
