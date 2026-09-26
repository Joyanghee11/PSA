import type { Metadata } from "next";
import Link from "next/link";
import { listPublicArtworks } from "@/lib/community";
import { ArtworkCard } from "@/components/community/ArtworkCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return lang === "ko"
    ? { title: "갤러리", description: "수중 사진작가의 작품을 소개하고 작가와 직접 연결합니다." }
    : { title: "Gallery", description: "Underwater photography, direct from the artist." };
}

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = l === "en" ? "en" : "ko";
  const ko = lang === "ko";
  const artworks = await listPublicArtworks(90);

  return (
    <div>
      <section className="bleed abyss -mt-8 mb-14">
        <div className="mag-container py-16 md:py-24 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8 rise">
            <span className="kicker">{ko ? "The Gallery" : "The Gallery"}</span>
            <h1 className="font-headline !text-white text-[40px] md:text-[64px] leading-[1.02] mt-4">
              {ko ? <>바다를 걸어 두는 일</> : <>Hang the ocean on your wall</>}
            </h1>
            <p className="muted mt-5 text-[17px] max-w-[560px] leading-relaxed">
              {ko
                ? "수중 사진작가의 작품을 소개합니다. 작품 크기와 재료, 에디션을 확인하고 작가에게 바로 문의하세요. 다이브 저널은 소개와 연결만 하며, 거래는 작가와 구매자가 직접 합니다."
                : "Original underwater photography. Check size, medium and edition, then message the artist directly. Dive Journal introduces and connects; the sale is between you and the artist."}
            </p>
          </div>
          <div className="md:col-span-4 flex md:justify-end gap-3 rise rise-2">
            <Link href={`/${lang}/gallery/new`} className="btn btn-lagoon">{ko ? "작품 등록하기" : "Submit your work"}</Link>
            <Link href={`/${lang}/gallery/mine`} className="btn btn-ghost !text-white !border-white/30 hover:!border-white">{ko ? "내 작품" : "My works"}</Link>
          </div>
        </div>
      </section>

      {artworks.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-headline text-2xl">{ko ? "첫 전시를 준비하고 있습니다" : "The first exhibition is being hung"}</p>
          <p className="text-muted-foreground mt-3">{ko ? "작가님의 작품을 기다립니다. 등록한 작품은 확인 후 게시됩니다." : "Submit your work. Each piece is reviewed before it goes up."}</p>
          <Link href={`/${lang}/gallery/new`} className="btn btn-primary mt-8">{ko ? "작품 등록하기" : "Submit your work"}</Link>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-10 [column-fill:_balance]">
          {artworks.map((art, i) => (
            <div key={art.id} className="break-inside-avoid mb-14">
              <ArtworkCard art={art} lang={lang} priority={i < 3} />
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-10 leading-relaxed border-t border-border pt-6">
        {ko
          ? "다이브 저널은 작품 정보 게시와 문의 전달만 하는 게시판이며 거래 당사자가 아닙니다. 가격, 결제, 배송, 환불은 작가와 구매자가 직접 약속합니다. 작품 설명은 작가가 제공한 정보입니다."
          : "Dive Journal only lists works and relays messages; it is not a party to any sale. Price, payment, shipping and returns are agreed directly between artist and buyer. Descriptions are provided by the artist."}
      </p>
    </div>
  );
}
