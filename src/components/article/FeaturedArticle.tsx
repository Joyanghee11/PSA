import Link from "next/link";
import type { Article, Lang } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

export function FeaturedArticle({
  article,
  lang,
}: {
  article: Article;
  lang: Lang;
}) {
  const content = article[lang];

  return (
    <article className="group relative bg-card border border-border rounded-xl overflow-hidden">
      <div className="md:flex">
        {article.imageUrl && (
          <div className="md:w-1/2 aspect-video md:aspect-auto bg-muted overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.imageAlt || content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className={`p-6 flex flex-col justify-center ${article.imageUrl ? "md:w-1/2" : "w-full"}`}>
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={article.category} lang={lang} />
            <span className="text-xs text-muted-foreground">
              {formatDate(article.publishedAt, lang)}
            </span>
          </div>
          <Link href={`/${lang}/article/${article.slug}`}>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-accent transition-colors">
              {content.title}
            </h2>
          </Link>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {content.summary}
          </p>
          <Link
            href={`/${lang}/article/${article.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            {lang === "ko" ? "\ub354 \uc77d\uae30" : "Read more"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
