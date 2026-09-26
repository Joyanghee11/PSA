import type { Metadata } from "next";
import Link from "next/link";
import { listPublicArtworks, publicUrl } from "@/lib/community";
import { DeepHero } from "@/components/layout/DeepHero";
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
      <DeepHero
        image={publicUrl("artworks", artworks[0]?.images[0])}
        kicker="The Gallery · Dive Journal"
        displayTop={ko ? "Hang the" : "Hang the"}
        displayEm="ocean."
        name={ko ? "바다를 걸어 두는 일" : "Collect the artist's ocean"}
        lead={ko
          ? "수중 사진작가의 작품을 소개합니다. 크기와 재료, 에디션을 확인하고 작가에게 바로 문의하세요. 거래는 작가와 구매자가 직접 합니다."
          : "Original underwater photography. Check size, medium and edition, then message the artist directly."}
        primary={{ href: `/${lang}/gallery/new`, label: ko ? "작품 등록하기" : "Submit your work" }}
        secondary={{ href: `/${lang}/gallery/mine`, label: ko ? "내 작품" : "My works" }}
        stats={[
          artworks.some((a) => a.status === "approved")
            ? { value: String(artworks.filter((a) => a.status === "approved").length), unit: ko ? "점" : "", eyebrow: "On view", label: ko ? "지금 전시 중인 작품" : "works on view" }
            : { value: ko ? "작가 모집" : "Open call", word: true, eyebrow: "First exhibition", label: ko ? "첫 전시를 함께할 작가를 찾습니다" : "Looking for our first artists" },
          { value: ko ? "직거래" : "Direct", word: true, eyebrow: "No commission", label: ko ? "작가와 구매자가 직접 약속합니다" : "Artist and buyer deal directly" },
          { value: ko ? "검수" : "Curated", word: true, eyebrow: "Reviewed", label: ko ? "편집부 확인 후 게시됩니다" : "Every work is reviewed" },
        ]}
        scrollCue={artworks.length > 0}
      />

      <div className="mt-16" />
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
