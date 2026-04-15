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
  const articles = getRecentArticles(20);
  const featured = articles[0];
  const row2 = articles.slice(1, 4);
  const row3 = articles.slice(4, 8);
  const sidebar = articles.slice(8, 14);
  const bottom = articles.slice(14);

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
    </div>
  );
}
