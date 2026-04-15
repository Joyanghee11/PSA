import Link from "next/link";
import type { Article, Lang } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

export function ArticleCard({
  article,
  lang,
  variant = "default",
}: {
  article: Article;
  lang: Lang;
  variant?: "default" | "compact" | "horizontal";
}) {
  const content = article[lang];

  if (variant === "compact") {
    return (
      <article className="group py-3 border-b border-border last:border-b-0">
        <div className="flex items-start gap-2 mb-1">
          <CategoryBadge category={article.category} lang={lang} />
          <span className="text-xs text-muted-foreground mt-0.5">
            {formatRelativeDate(article.publishedAt, lang)}
          </span>
        </div>
        <Link href={`/${lang}/article/${article.slug}`}>
          <h3 className="text-base font-subheadline group-hover:text-accent transition-colors line-clamp-2">
            {content.title}
          </h3>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4">
        {article.imageUrl && (
          <Link
            href={`/${lang}/article/${article.slug}`}
            className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24"
          >
            <img
              src={article.imageUrl}
              alt={article.imageAlt || content.title}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={article.category} lang={lang} />
            <span className="text-xs text-muted-foreground">
              {formatRelativeDate(article.publishedAt, lang)}
            </span>
          </div>
          <Link href={`/${lang}/article/${article.slug}`}>
            <h3 className="text-base font-subheadline group-hover:text-accent transition-colors line-clamp-2">
              {content.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {content.summary}
          </p>
        </div>
      </article>
    );
  }

  // Default card
  return (
    <article className="group">
      {article.imageUrl && (
        <Link href={`/${lang}/article/${article.slug}`} className="block mb-3">
          <div className="aspect-[16/10] overflow-hidden bg-muted">
            <img
              src={article.imageUrl}
              alt={article.imageAlt || content.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </Link>
      )}
      <div className="flex items-center gap-2 mb-2">
        <CategoryBadge category={article.category} lang={lang} />
        <span className="text-xs text-muted-foreground">
          {formatRelativeDate(article.publishedAt, lang)}
        </span>
      </div>
      <Link href={`/${lang}/article/${article.slug}`}>
        <h3 className="text-lg font-subheadline group-hover:text-accent transition-colors line-clamp-2 mb-1">
          {content.title}
        </h3>
      </Link>
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {content.summary}
      </p>
    </article>
  );
}
