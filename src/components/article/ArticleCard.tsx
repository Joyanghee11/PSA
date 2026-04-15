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
  variant?: "default" | "compact" | "horizontal" | "headline";
}) {
  const content = article[lang];

  // Compact: title only with dot separator
  if (variant === "compact") {
    return (
      <article className="py-2.5 border-b border-border last:border-b-0">
        <Link href={`/${lang}/article/${article.slug}`} className="group flex items-start gap-2">
          <span className="text-accent mt-1.5 text-[6px]">●</span>
          <h3 className="text-[15px] font-semibold leading-snug group-hover:text-accent-blue transition-colors line-clamp-2" style={{ wordBreak: "keep-all" }}>
            {content.title}
          </h3>
        </Link>
      </article>
    );
  }

  // Horizontal: image left, text right
  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4 py-4 border-b border-border last:border-b-0">
        {article.imageUrl && (
          <Link href={`/${lang}/article/${article.slug}`} className="flex-shrink-0">
            <div className="w-[140px] h-[90px] md:w-[180px] md:h-[110px] overflow-hidden bg-muted">
              <img
                src={article.imageUrl}
                alt={article.imageAlt || content.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} lang={lang} />
          <Link href={`/${lang}/article/${article.slug}`}>
            <h3 className="text-[16px] font-subheadline mt-1 group-hover:text-accent-blue transition-colors line-clamp-2">
              {content.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {content.summary}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {formatRelativeDate(article.publishedAt, lang)}
          </span>
        </div>
      </article>
    );
  }

  // Headline: big title, prominent
  if (variant === "headline") {
    return (
      <article className="group">
        {article.imageUrl && (
          <Link href={`/${lang}/article/${article.slug}`} className="block mb-3">
            <div className="aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={article.imageUrl}
                alt={article.imageAlt || content.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </Link>
        )}
        <CategoryBadge category={article.category} lang={lang} />
        <Link href={`/${lang}/article/${article.slug}`}>
          <h2 className="text-[22px] md:text-[26px] font-headline mt-2 group-hover:text-accent-blue transition-colors">
            {content.title}
          </h2>
        </Link>
        <p className="text-[15px] text-muted-foreground mt-2 leading-relaxed line-clamp-3">
          {content.summary}
        </p>
        <span className="text-xs text-muted-foreground mt-2 block">
          {formatRelativeDate(article.publishedAt, lang)}
        </span>
      </article>
    );
  }

  // Default card with image on top
  return (
    <article className="group">
      {article.imageUrl && (
        <Link href={`/${lang}/article/${article.slug}`} className="block mb-2">
          <div className="aspect-[16/10] overflow-hidden bg-muted">
            <img
              src={article.imageUrl}
              alt={article.imageAlt || content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      <CategoryBadge category={article.category} lang={lang} />
      <Link href={`/${lang}/article/${article.slug}`}>
        <h3 className="text-[16px] font-subheadline mt-1 group-hover:text-accent-blue transition-colors line-clamp-2">
          {content.title}
        </h3>
      </Link>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
        {content.summary}
      </p>
    </article>
  );
}
