import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { getDictionary } from "@/config/i18n";
import { getRecentArticles } from "@/lib/content";
import { FeaturedArticle } from "@/components/article/FeaturedArticle";
import { ArticleList } from "@/components/article/ArticleList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang as Lang);
  return {
    title: dict.siteName,
    description:
      lang === "ko"
        ? "\uc804 \uc138\uacc4 \ud504\ub9ac\ub2e4\uc774\ube59 \ub274\uc2a4\ub97c AI\ub85c \uc790\ub3d9 \uc0dd\uc131\ud558\uc5ec \uc804\ub2ec\ud569\ub2c8\ub2e4."
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
  const rest = articles.slice(1);

  return (
    <div className="space-y-10">
      {featured ? (
        <section>
          <FeaturedArticle article={featured} lang={lang as Lang} />
        </section>
      ) : (
        <section className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">
            {dict.siteName}
          </h1>
          <p className="text-lg text-muted-foreground">
            {dict.siteTagline}
          </p>
          <p className="text-muted-foreground mt-2">
            {lang === "ko"
              ? "\uacf5 \uae30\uc0ac\uac00 \ub9e4\uc77c \uc790\ub3d9\uc73c\ub85c \uc0dd\uc131\ub429\ub2c8\ub2e4."
              : "Articles are generated automatically every day."}
          </p>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">{dict.article.latestNews}</h2>
          <ArticleList articles={rest} lang={lang as Lang} />
        </section>
      )}
    </div>
  );
}
