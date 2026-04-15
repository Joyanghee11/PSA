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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Image - takes 7 cols */}
        {article.imageUrl && (
          <div className="md:col-span-7">
            <Link href={`/${lang}/article/${article.slug}`} className="block">
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={article.imageUrl}
                  alt={article.imageAlt || content.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </Link>
          </div>
        )}
        {/* Text - takes 5 cols */}
        <div className={`${article.imageUrl ? "md:col-span-5" : "md:col-span-12"} flex flex-col justify-center`}>
          <CategoryBadge category={article.category} lang={lang} />
          <Link href={`/${lang}/article/${article.slug}`}>
            <h2 className="text-[24px] md:text-[30px] font-headline mt-2 group-hover:text-accent-blue transition-colors">
              {content.title}
            </h2>
          </Link>
          <p className="text-[15px] text-muted-foreground mt-3 leading-relaxed line-clamp-4">
            {content.summary}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs text-muted-foreground">
              {formatDate(article.publishedAt, lang)}
            </span>
            <span className="text-xs text-muted-foreground">|</span>
            <span className="text-xs text-muted-foreground">
              {lang === "ko" ? "다이브저널" : "Dive Journal"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
