import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import Link from "next/link";
import { getDictionary } from "@/config/i18n";
import { getAllArticlesAsync } from "@/lib/content";
import { FeaturedArticle } from "@/components/article/FeaturedArticle";
import { ArticleCard } from "@/components/article/ArticleCard";
import { AdSlot } from "@/components/ads/AdBanner";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "ko"
        ? "다이브 저널 - 전 세계 프리다이빙 뉴스"
        : "Dive Journal - Worldwide Freediving News",
    description:
      lang === "ko"
        ? "전 세계 프리다이빙 소식을 AI로 자동 생성하여 전달합니다."
        : "AI-generated worldwide freediving news delivered daily.",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  const allArticles = await getAllArticlesAsync();
  const nonVideo = allArticles.filter((a) => a.category !== "video");
  const videos = allArticles.filter((a) => a.category === "video").slice(0, 4);
  const articles = nonVideo.slice(0, 20);
  const featured = articles[0];
  const row2 = articles.slice(1, 4);
  const row3 = articles.slice(4, 8);
  const sidebar = articles.slice(8, 14);
  const bottom = articles.slice(14);

  // 인기 기사: 가장 오래된 기사 중 상위 5개 (=가장 오래 노출됨)
  const popular = [...nonVideo]
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    .slice(0, 5);

  if (!featured) {
    return (
      <div className="text-center py-24">
        <h1 className="text-5xl font-headline mb-4">
          {lang === "ko" ? "다이브 저널" : "Dive Journal"}
        </h1>
        <p className="text-lg text-muted-foreground">{dict.siteTagline}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Top story */}
      <section className="pb-6 border-b-thick">
        <FeaturedArticle article={featured} lang={lang as Lang} />
      </section>

      {/* Row 2: 3 columns with images */}
      {row2.length > 0 && (
        <section className="py-6 border-b-thin">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {row2.map((article) => (
              <ArticleCard key={article.slug} article={article} lang={lang as Lang} variant="default" />
            ))}
          </div>
        </section>
      )}

      {/* Popular articles */}
      {popular.length > 0 && (
        <section className="py-6 border-b-thin">
          <div className="section-title">
            <span>🔥 {lang === "ko" ? "인기 기사" : "Popular"}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popular.map((article, i) => (
              <Link key={article.slug} href={`/${lang}/article/${article.slug}`} className="group">
                <div className="flex items-start gap-2">
                  <span className="text-2xl font-black text-accent/30 leading-none">{i + 1}</span>
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-accent-blue transition-colors line-clamp-3" style={{ wordBreak: "keep-all" }}>
                    {article[lang as Lang].title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ad: between articles */}
      <AdSlot position="between-articles" />

      {/* Row 3: main content + sidebar layout */}
      <section className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main area */}
          <div className="lg:col-span-8">
            <div className="section-title">
              <span>{lang === "ko" ? "주요 뉴스" : "Main News"}</span>
            </div>
            <div className="space-y-0">
              {row3.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  lang={lang as Lang}
                  variant="horizontal"
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:border-l lg:border-border lg:pl-6">
            <div className="section-title">
              <span>{lang === "ko" ? "최신 기사" : "Latest"}</span>
            </div>
            <div>
              {sidebar.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  lang={lang as Lang}
                  variant="compact"
                />
              ))}
            </div>
            {/* Sidebar ad */}
            <div className="mt-6">
              <AdSlot position="sidebar" />
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom grid */}
      {bottom.length > 0 && (
        <section className="py-6 border-t border-border">
          <div className="section-title">
            <span>{lang === "ko" ? "더 많은 기사" : "More Stories"}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bottom.map((article) => (
              <ArticleCard key={article.slug} article={article} lang={lang as Lang} variant="default" />
            ))}
          </div>
        </section>
      )}

      {/* Video section */}
      {videos.length > 0 && (
        <section className="py-6 border-t-2 border-border-strong">
          <div className="section-title">
            <span>📺 {lang === "ko" ? "추천 영상" : "Featured Videos"}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map((v) => {
              const videoId = v.en.body.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1];
              return (
                <Link key={v.slug} href={`/${lang}/article/${v.slug}`} className="group block">
                  <div className="relative aspect-video bg-muted overflow-hidden rounded">
                    <img
                      src={v.imageUrl || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={v[lang as Lang].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-accent/90 transition-colors">
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold mt-2 line-clamp-2 group-hover:text-accent-blue transition-colors" style={{ wordBreak: "keep-all" }}>
                    {v[lang as Lang].title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
