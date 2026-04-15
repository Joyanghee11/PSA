import type { Article, Lang } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

export function ArticleList({
  articles,
  lang,
}: {
  articles: Article[];
  lang: Lang;
}) {
  if (articles.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-16">
        {lang === "ko" ? "기사가 없습니다." : "No articles found."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} lang={lang} />
      ))}
    </div>
  );
}
