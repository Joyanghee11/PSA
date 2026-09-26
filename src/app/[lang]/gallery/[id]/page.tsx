import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtwork, getSessionUser, publicUrl, formatKrw, formatSize } from "@/lib/community";
import { InquiryForm } from "@/components/community/InquiryForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const art = await getArtwork(id);
  if (!art) return {};
  const img = publicUrl("artworks", art.images[0]);
  return {
    title: `${art.title} · ${art.artist_name}`,
    description: art.description?.slice(0, 150) ?? undefined,
    openGraph: img ? { images: [img] } : undefined,
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang: l, id } = await params;
  const lang = l === "en" ? "en" : "ko";
  const ko = lang === "ko";
  const [art, user] = await Promise.all([getArtwork(id), getSessionUser()]);
  if (!art) notFound();

  const isOwner = user?.id === art.user_id;
  const size = formatSize(art);
  const images = art.images.map((p) => publicUrl("artworks", p)).filter(Boolean) as string[];

  const spec: Array<[string, string | null]> = [
    [ko ? "작가" : "Artist", art.artist_name],
    [ko ? "제작 연도" : "Year", art.year ? String(art.year) : null],
    [ko ? "재료·기법" : "Medium", art.medium],
    [ko ? "크기" : "Size", size],
    [ko ? "에디션" : "Edition", art.edition],
    [ko ? "액자" : "Framing", art.framing],
    [ko ? "촬영지" : "Location", art.location],
    [ko ? "배송·설치" : "Shipping", art.shipping],
  ];

  const statusNote =
    art.status === "pending" ? (ko ? "검토 중인 작품입니다. 승인되면 갤러리에 게시됩니다." : "Under review. It will be listed once approved.")
    : art.status === "rejected" ? (ko ? `게시되지 않았습니다.${art.reject_reason ? ` 사유: ${art.reject_reason}` : ""}` : `Not approved.${art.reject_reason ? ` Reason: ${art.reject_reason}` : ""}`)
    : art.status === "hidden" ? (ko ? "숨긴 작품입니다. 방문자에게 보이지 않습니다." : "Hidden from visitors.")
    : null;

  return (
    <article>
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href={`/${lang}/gallery`} className="hover:text-accent">{ko ? "갤러리" : "Gallery"}</Link>
        <span className="mx-2">/</span>
        <span className="text-headline">{art.title}</span>
      </nav>

      {isOwner && statusNote && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-4 text-sm flex items-center justify-between gap-4">
          <span>{statusNote}</span>
          <Link href={`/${lang}/gallery/mine`} className="btn btn-ghost !h-9">{ko ? "내 작품 관리" : "Manage"}</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-7 space-y-8">
          {images.map((src, i) => (
            <figure key={src} className={`frame ${i === 0 ? "rise" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${art.title} ${i + 1}`} className="w-full h-auto" loading={i === 0 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 space-y-8">
            <header>
              <span className="kicker">{ko ? "작품" : "Artwork"}</span>
              <h1 className="font-headline text-[34px] md:text-[44px] mt-3">{art.title}</h1>
              <p className="text-lg text-muted-foreground mt-2 font-italic-serif">{art.artist_name}</p>
              <div className="mt-5 flex items-center gap-3">
                {art.status === "sold" ? (
                  <span className="chip chip-sold">{ko ? "판매 완료" : "Sold"}</span>
                ) : (
                  <span className="text-2xl font-semibold text-headline">{formatKrw(art.price_krw, lang)}</span>
                )}
              </div>
            </header>

            <dl className="spec">
              {spec.filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            {art.description && (
              <section>
                <h2 className="font-subheadline text-lg mb-3">{ko ? "작품 이야기" : "About the work"}</h2>
                <div className="text-[15.5px] leading-[1.9] whitespace-pre-line text-foreground">{art.description}</div>
              </section>
            )}

            {art.artist_bio && (
              <section className="rounded-2xl bg-muted/60 p-5">
                <h2 className="font-subheadline text-base mb-2">{ko ? "작가 소개" : "About the artist"}</h2>
                <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{art.artist_bio}</p>
              </section>
            )}

            <section id="inquiry" className="lift p-6">
              <h2 className="font-subheadline text-lg mb-4">{ko ? "작가에게 구매 문의" : "Inquire with the artist"}</h2>
              <InquiryForm
                artworkId={art.id}
                lang={lang}
                signedIn={!!user}
                disabledReason={
                  isOwner ? (ko ? "본인 작품입니다. 받은 문의는 내 작품 화면에서 확인합니다." : "This is your work. See inquiries in My works.")
                  : art.status === "sold" ? (ko ? "판매가 끝난 작품입니다." : "This work has been sold.")
                  : art.status !== "approved" ? (ko ? "지금은 문의할 수 없는 작품입니다." : "Inquiries are closed.")
                  : null
                }
              />
            </section>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {ko
                ? "다이브 저널은 작가와 구매자를 연결하는 게시판이며 거래 당사자가 아닙니다. 결제와 배송은 작가와 직접 약속하세요."
                : "Dive Journal connects artists and buyers and is not a party to the sale. Agree payment and delivery directly with the artist."}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
