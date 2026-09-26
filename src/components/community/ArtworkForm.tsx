"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitArtwork } from "@/app/actions/community";
import { ImageUploader } from "./ImageUploader";

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function ArtworkForm({ lang, defaultArtist }: { lang: "ko" | "en"; defaultArtist?: string }) {
  const ko = lang === "ko";
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-10"
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await submitArtwork(fd);
          if (!res.ok) {
            setError(res.error);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          router.push(`/${lang}/gallery/mine?submitted=1`);
        })
      }
    >
      {error && <p className="rounded-xl bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger p-4 text-sm">{error}</p>}

      <section className="grid gap-5">
        <h2 className="font-subheadline text-xl">{ko ? "1. 사진" : "1. Photos"}</h2>
        <p className="text-sm text-muted-foreground -mt-3">{ko ? "첫 번째 사진이 대표 이미지가 됩니다. 액자에 건 모습이나 세부 사진을 함께 올리면 구매자가 판단하기 쉽습니다. 최대 8장." : "The first photo is the cover. Add framed or detail shots. Up to 8."}</p>
        <ImageUploader bucket="artworks" name="images" max={8} lang={lang} />
      </section>

      <section className="grid gap-5">
        <h2 className="font-subheadline text-xl">{ko ? "2. 작품 정보" : "2. The work"}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field id="title" label={ko ? "작품명 *" : "Title *"}><input id="title" name="title" required maxLength={120} className="input" /></Field>
          <Field id="year" label={ko ? "제작 연도" : "Year"}><input id="year" name="year" inputMode="numeric" maxLength={4} className="input" placeholder="2026" /></Field>
          <Field id="medium" label={ko ? "재료·기법" : "Medium"} hint={ko ? "예: 피그먼트 프린트, 하네뮬레 포토 래그 308g" : "e.g. Pigment print on Hahnemühle Photo Rag"}><input id="medium" name="medium" maxLength={120} className="input" /></Field>
          <Field id="edition" label={ko ? "에디션" : "Edition"} hint={ko ? "예: 에디션 3/10, 단일 원본" : "e.g. 3/10, unique"}><input id="edition" name="edition" maxLength={60} className="input" /></Field>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <Field id="width_cm" label={ko ? "가로(cm)" : "Width (cm)"}><input id="width_cm" name="width_cm" inputMode="decimal" className="input" /></Field>
          <Field id="height_cm" label={ko ? "세로(cm)" : "Height (cm)"}><input id="height_cm" name="height_cm" inputMode="decimal" className="input" /></Field>
          <Field id="depth_cm" label={ko ? "두께(cm)" : "Depth (cm)"}><input id="depth_cm" name="depth_cm" inputMode="decimal" className="input" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field id="framing" label={ko ? "액자" : "Framing"} hint={ko ? "예: 원목 액자 포함, 무반사 아크릴" : "e.g. Oak frame, museum acrylic"}><input id="framing" name="framing" maxLength={200} className="input" /></Field>
          <Field id="location" label={ko ? "촬영지" : "Location"}><input id="location" name="location" maxLength={120} className="input" placeholder={ko ? "예: 필리핀 모알보알" : "e.g. Moalboal, Philippines"} /></Field>
        </div>
        <Field id="description" label={ko ? "작품 설명" : "Description"} hint={ko ? "촬영한 순간, 장비, 작품에 담은 이야기를 적어 주세요." : "The moment, the gear, the story."}>
          <textarea id="description" name="description" maxLength={5000} rows={7} className="input" />
        </Field>
      </section>

      <section className="grid gap-5">
        <h2 className="font-subheadline text-xl">{ko ? "3. 가격과 거래 조건" : "3. Price & terms"}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field id="price_krw" label={ko ? "판매 가격(원)" : "Price (KRW)"} hint={ko ? "비워 두면 '가격 문의'로 표시됩니다." : "Leave blank for 'Price on request'."}><input id="price_krw" name="price_krw" inputMode="numeric" className="input" placeholder="850000" /></Field>
          <Field id="shipping" label={ko ? "배송·설치" : "Shipping"} hint={ko ? "예: 수도권 직접 설치, 그 외 택배" : "e.g. Seoul hand delivery, courier elsewhere"}><input id="shipping" name="shipping" maxLength={300} className="input" /></Field>
        </div>
      </section>

      <section className="grid gap-5">
        <h2 className="font-subheadline text-xl">{ko ? "4. 작가" : "4. Artist"}</h2>
        <Field id="artist_name" label={ko ? "작가명 *" : "Artist name *"}><input id="artist_name" name="artist_name" required maxLength={60} defaultValue={defaultArtist} className="input" /></Field>
        <Field id="artist_bio" label={ko ? "작가 소개" : "Artist bio"} hint={ko ? "경력, 전시, 인스타그램 등을 적을 수 있습니다." : "Background, exhibitions, social links."}>
          <textarea id="artist_bio" name="artist_bio" maxLength={1000} rows={4} className="input" />
        </Field>
      </section>

      <div className="rounded-2xl bg-muted/60 p-5 text-sm text-muted-foreground leading-relaxed">
        {ko
          ? "등록한 작품은 편집부가 확인한 뒤 게시됩니다. 구매 문의는 '내 작품' 화면에 쌓이고, 거래는 작가님이 문의자와 직접 진행합니다. 본인이 저작권을 가진 작품만 올려 주세요."
          : "Each submission is reviewed before it goes live. Inquiries arrive in My works, and you deal with buyers directly. Submit only work you own the rights to."}
      </div>

      <button className="btn btn-primary justify-self-start !h-12 !px-8" disabled={pending}>
        {pending ? (ko ? "등록하는 중…" : "Submitting…") : ko ? "검토 요청하기" : "Submit for review"}
      </button>
    </form>
  );
}
