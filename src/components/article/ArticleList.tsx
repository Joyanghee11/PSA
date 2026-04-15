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
      <p className="text-center text-muted-foreground py-12">
        {lang === "ko" ? "\uae30\uc0ac\uac00 \uc5c6\uc2b5\ub2c8\ub2e4." : "No articles found."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} lang={lang} />
      ))}
    </div>
  );
}
