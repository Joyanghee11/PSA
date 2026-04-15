import Link from "next/link";
import type { Article, Lang } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

export function ArticleCard({
  article,
  lang,
}: {
  article: Article;
  lang: Lang;
}) {
  const content = article[lang];

  return (
    <article className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {article.imageUrl && (
        <Link href={`/${lang}/article/${article.slug}`}>
          <div className="aspect-video bg-muted overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.imageAlt || content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={article.category} lang={lang} />
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(article.publishedAt, lang)}
          </span>
        </div>
        <Link href={`/${lang}/article/${article.slug}`}>
          <h3 className="text-lg font-semibold leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {content.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {content.summary}
        </p>
      </div>
    </article>
  );
}
