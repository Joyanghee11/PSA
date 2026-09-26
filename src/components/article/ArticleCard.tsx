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
  const href = `/${lang}/article/${article.slug}`;

  if (variant === "compact") {
    return (
      <article className="py-3.5 border-b border-border last:border-b-0">
        <Link href={href} className="group block">
          <h3 className="text-[15.5px] font-subheadline leading-snug text-headline group-hover:text-accent transition-colors line-clamp-2">{content.title}</h3>
          <span className="text-xs text-muted-foreground mt-1 block">{formatRelativeDate(article.publishedAt, lang)}</span>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group grid grid-cols-[1fr_140px] md:grid-cols-[1fr_220px] gap-5 py-6 border-b border-border last:border-b-0">
        <div className="min-w-0">
          <CategoryBadge category={article.category} lang={lang} />
          <Link href={href}>
            <h3 className="text-[19px] md:text-[22px] font-subheadline mt-1.5 text-headline group-hover:text-accent transition-colors line-clamp-2">{content.title}</h3>
          </Link>
          <p className="text-[15px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{content.summary}</p>
          <span className="text-xs text-muted-foreground mt-3 block">{formatRelativeDate(article.publishedAt, lang)}</span>
        </div>
        {article.imageUrl && (
          <Link href={href} className="block aspect-[4/3] rounded-xl overflow-hidden bg-muted shadow-[var(--shadow-1)] group-hover:shadow-[var(--shadow-2)] transition-shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.imageAlt || content.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </Link>
        )}
      </article>
    );
  }

  const big = variant === "headline";
  return (
    <article className="lift h-full flex flex-col">
      {article.imageUrl && (
        <Link href={href} className={`media block ${big ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.imageUrl} alt={article.imageAlt || content.title} loading="lazy" className="w-full h-full object-cover" />
        </Link>
      )}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <CategoryBadge category={article.category} lang={lang} />
        <Link href={href}>
          <h3 className={`${big ? "text-[22px] md:text-[26px] font-headline" : "text-[18px] font-subheadline"} mt-1.5 text-headline hover:text-accent transition-colors line-clamp-3`}>{content.title}</h3>
        </Link>
        <p className="text-[14.5px] text-muted-foreground mt-2.5 line-clamp-3 leading-relaxed">{content.summary}</p>
        <span className="text-xs text-muted-foreground mt-auto pt-4">{formatRelativeDate(article.publishedAt, lang)}</span>
      </div>
    </article>
  );
}
