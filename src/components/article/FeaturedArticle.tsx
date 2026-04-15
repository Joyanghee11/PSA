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
    <article className="group">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {article.imageUrl && (
          <Link href={`/${lang}/article/${article.slug}`} className="block">
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={article.imageUrl}
                alt={article.imageAlt || content.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </Link>
        )}
        <div className={`flex flex-col justify-center ${!article.imageUrl ? "md:col-span-2" : ""}`}>
          <div className="flex items-center gap-3 mb-3">
            <CategoryBadge category={article.category} lang={lang} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {formatDate(article.publishedAt, lang)}
            </span>
          </div>
          <Link href={`/${lang}/article/${article.slug}`}>
            <h2 className="text-2xl md:text-4xl font-headline group-hover:text-accent transition-colors mb-4">
              {content.title}
            </h2>
          </Link>
          <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {content.summary}
          </p>
          <Link
            href={`/${lang}/article/${article.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            {lang === "ko" ? "기사 전문 보기" : "Read full article"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
