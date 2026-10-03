import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import Link from "next/link";
import { getDictionary } from "@/config/i18n";
import { getAllArticlesAsync } from "@/lib/content";
import { FeaturedArticle } from "@/components/article/FeaturedArticle";
import { ArticleCard } from "@/components/article/ArticleCard";
import { AdSlot } from "@/components/ads/AdBanner";
import { VideoCarousel } from "@/components/article/VideoCarousel";
import { ArtworkCard } from "@/components/community/ArtworkCard";
import { listPublicArtworks, listPublishedContests, publicUrl } from "@/lib/community";
import { phaseLabel, fmtDate } from "@/lib/contest-format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return lang === "ko"
    ? { title: "다이브 저널 - 바다를 읽는 매거진", description: "프리다이빙과 스쿠버, 수중 사진을 다루는 웹 매거진. 저널, 갤러리, 사진 콘테스트." }
    : { title: "Dive Journal - A magazine of the sea", description: "Freediving, scuba and underwater photography. Journal, gallery and photo contests." };
}

/** 한국 날짜 기준 일련번호. 자정(KST)마다 1씩 오른다. */
function kstDayNumber(time = Date.now()) {
  return Math.floor((time + 9 * 3_600_000) / 86_400_000);
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = (l === "en" ? "en" : "ko") as Lang;
  const ko = lang === "ko";
  const dict = getDictionary(lang);

  const [allArticles, artworks, contests] = await Promise.all([
    getAllArticlesAsync(),
    listPublicArtworks(4).catch(() => []),
    listPublishedContests().catch(() => []),
  ]);
  const nonVideo = allArticles.filter((a) => a.category !== "video");
  const videos = allArticles.filter((a) => a.category === "video");

  const pinOrder: Record<string, number> = { top: 0, featured: 1 };
  const sorted = [...nonVideo].sort((a, b) => {
    const ap = a.pinned ? pinOrder[a.pinned] ?? 2 : 2;
    const bp = b.pinned ? pinOrder[b.pinned] ?? 2 : 2;
    if (ap !== bp) return ap - bp;
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
  });

  // 커버 스토리는 한국 날짜가 바뀔 때마다 최신 사진 기사 5편 중 다음 편으로 넘어간다.
  // 편집자가 맨 위로 고정한 기사는 고정한 그날(updatedAt 기준)에만 커버를 차지한다.
  const kstDay = kstDayNumber();
  const pool = nonVideo
    .filter((a) => a.imageUrl)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 5);
  const top = sorted[0]?.pinned === "top" ? sorted[0] : undefined;
  const cover = (top && kstDayNumber(Date.parse(top.updatedAt)) === kstDay) || pool.length === 0 ? sorted[0] : pool[kstDay % pool.length];
  const rest = sorted.filter((a) => a !== cover);
  const trending = rest.slice(0, 3);
  const main = rest.slice(3, 8);
  const latest = rest.slice(8, 14);
  const more = rest.slice(14, 22);
  const mostRead = [...nonVideo].sort((a, b) => (b.evaluation?.score ?? 0) - (a.evaluation?.score ?? 0)).slice(0, 5);
  const contest = contests[0];

  if (!cover) {
    return (
      <div className="text-center py-24">
        <h1 className="font-headline text-5xl mb-4">{dict.siteName}</h1>
        <p className="text-lg text-muted-foreground">{dict.siteTagline}</p>
      </div>
    );
  }

  return (
    <div className="space-y-14 md:space-y-20">
      {/* 커버 스토리 */}
      <FeaturedArticle article={cover} lang={lang} />

      {/* Trending — 화제의 기사 */}
      {trending.length > 0 && (
        <section>
          <div className="mag-section-head">
            <h2 className="en-head">Trending</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {trending.map((a, i) => (
              <div key={a.slug} className={`rise rise-${i + 2} ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <ArticleCard article={a} lang={lang} variant={i === 0 ? "headline" : "default"} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 주요 기사 + 많이 읽은 기사 */}
      <section className="grid lg:grid-cols-12 gap-12 lg:gap-14">
        <div className="lg:col-span-8 min-w-0">
          <div className="mag-section-head"><h2 className="en-head">Must Read</h2></div>
          {main.map((a) => (
            <ArticleCard key={a.slug} article={a} lang={lang} variant="horizontal" />
          ))}
        </div>
        <aside className="lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-1 gap-10 lg:gap-12 content-start">
          <div className="rounded-[var(--radius)] border border-border bg-card p-6 md:p-7">
            <h3 className="en-head !text-[26px] mb-1">Editors&apos; Picks</h3>
            <ol className="ranked">
              {mostRead.map((a) => (
                <li key={a.slug}>
                  <Link href={`/${lang}/article/${a.slug}`} className="text-[15px] leading-snug font-subheadline text-headline hover:text-accent transition-colors line-clamp-3">{a[lang].title}</Link>
                </li>
              ))}
            </ol>
          </div>
          {latest.length > 0 && (
            <div>
              <h3 className="en-head !text-[26px] border-b border-border pb-3">Latest</h3>
              {latest.map((a) => (
                <ArticleCard key={a.slug} article={a} lang={lang} variant="compact" />
              ))}
            </div>
          )}
          <div className="md:col-span-2 lg:col-span-1">
            <AdSlot position="sidebar" />
          </div>
        </aside>
      </section>

      {/* 갤러리 띠 */}
      <section className="bleed bg-muted">
        <div className="mag-container py-14 md:py-20">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-10 md:mb-12">
            <div className="lg:col-span-7">
              <span className="kicker">The Gallery</span>
              <h2 className="en-head !text-[36px] md:!text-[52px] mt-3 !leading-[1.05]">Collect the <em>artist&apos;s ocean.</em></h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <p className="text-muted-foreground leading-relaxed">{ko ? "수중 사진작가의 작품을 크기와 재료, 에디션까지 자세히 소개하고 작가와 바로 연결합니다." : "Size, medium and edition in full, with a direct line to the artist."}</p>
              <div className="mt-5 flex lg:justify-end gap-3">
                <Link href={`/${lang}/gallery/new`} className="btn btn-ghost">{ko ? "작품 등록" : "Submit work"}</Link>
              </div>
            </div>
          </div>
          {artworks.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {artworks.map((art) => (
                <ArtworkCard key={art.id} art={art} lang={lang} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">{ko ? "곧 첫 전시가 열립니다." : "The first exhibition opens soon."}</p>
          )}
        </div>
      </section>

      {/* 콘테스트 */}
      {contest && (
        <section>
          <Link href={`/${lang}/contest/${contest.slug}`} className="group grid md:grid-cols-12 overflow-hidden lift">
            <div className="md:col-span-6 aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {contest.cover_path && <img src={publicUrl("contest", contest.cover_path)!} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />}
            </div>
            <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-center">
              <span className="kicker">Photo Contest</span>
              <h2 className="font-headline text-[30px] md:text-[40px] mt-3">{ko ? contest.title_ko : contest.title_en || contest.title_ko}</h2>
              {contest.theme_ko && <p className="text-muted-foreground mt-3 text-lg">{ko ? "주제" : "Theme"} · {contest.theme_ko}</p>}
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <span className="chip chip-live">{phaseLabel(contest, ko)}</span>
                <span className="text-sm text-muted-foreground">{fmtDate(contest.submit_starts_at, ko)} ~ {fmtDate(contest.vote_ends_at, ko)}</span>
              </div>
              <span className="mt-8 font-semibold text-accent group-hover:translate-x-1 transition-transform">{ko ? "참가하기 →" : "Take part →"}</span>
            </div>
          </Link>
        </section>
      )}

      {videos.length > 0 && (
        <section>
          <div className="mag-section-head"><h2 className="en-head">Watch</h2></div>
          <VideoCarousel articles={videos} lang={lang} />
        </section>
      )}

      <AdSlot position="between-articles" />

      {more.length > 0 && (
        <section>
          <div className="mag-section-head"><h2 className="en-head">More Stories</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {more.map((a) => (
              <ArticleCard key={a.slug} article={a} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
