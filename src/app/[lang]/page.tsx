import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { getDictionary } from "@/config/i18n";
import { getRecentArticles } from "@/lib/content";
import { FeaturedArticle } from "@/components/article/FeaturedArticle";
import { ArticleCard } from "@/components/article/ArticleCard";

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
  const articles = getRecentArticles(13);
  const featured = articles[0];
  const secondary = articles.slice(1, 4);
  const rest = articles.slice(4);

  if (!featured) {
    return (
      <div className="text-center py-24">
        <h1 className="text-5xl font-headline mb-4">
          {lang === "ko" ? "다이브 저널" : "Dive Journal"}
        </h1>
        <p className="text-lg text-muted-foreground">{dict.siteTagline}</p>
        <p className="text-muted-foreground mt-3">
          {lang === "ko"
            ? "기사가 매일 자동으로 생성됩니다."
            : "Articles are generated automatically every day."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Top story */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="section-label">
            {lang === "ko" ? "오늘의 주요 기사" : "TOP STORY"}
          </span>
          <hr className="divider flex-1" />
        </div>
        <FeaturedArticle article={featured} lang={lang as Lang} />
      </section>

      <hr className="divider-double my-8" />

      {/* Secondary stories */}
      {secondary.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:divide-x md:divide-border">
            {secondary.map((article, i) => (
              <div key={article.slug} className={i > 0 ? "md:pl-8" : ""}>
                <ArticleCard article={article} lang={lang as Lang} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* More stories */}
      {rest.length > 0 && (
        <>
          <hr className="divider-strong my-8" />
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="section-label">
                {dict.article.latestNews}
              </span>
              <hr className="divider flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 md:divide-x md:divide-border">
              {rest.map((article, i) => (
                <div
                  key={article.slug}
                  className={`${i % 3 !== 0 ? "md:pl-8" : ""} ${i >= 3 ? "md:border-t md:border-border md:pt-6" : ""}`}
                >
                  <ArticleCard
                    article={article}
                    lang={lang as Lang}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
