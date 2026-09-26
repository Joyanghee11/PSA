import Link from "next/link";
import type { Article, Lang } from "@/lib/types";
import { formatDate, getCategoryLabel } from "@/lib/utils";

/** 커버 스토리: 사진을 가득 채우고 제목을 사진 위에 얹는다 */
export function FeaturedArticle({ article, lang }: { article: Article; lang: Lang }) {
  const content = article[lang];
  const href = `/${lang}/article/${article.slug}`;

  if (!article.imageUrl) {
    return (
      <Link href={href} className="block abyss rounded-[22px] p-10 md:p-16 shadow-[var(--shadow-3)]">
        <span className="kicker">{lang === "ko" ? "커버 스토리" : "Cover story"}</span>
        <h1 className="font-headline !text-white text-[34px] md:text-[56px] mt-4 max-w-[900px]">{content.title}</h1>
        <p className="muted mt-5 text-lg max-w-[720px] line-clamp-3">{content.summary}</p>
      </Link>
    );
  }

  return (
    <Link href={href} className="cover group rise">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.imageUrl} alt={article.imageAlt || content.title} className="bg" />
      <div className="cover-body">
        <span className="kicker !text-[var(--lagoon)]">
          {lang === "ko" ? "커버 스토리" : "Cover story"} · {getCategoryLabel(article.category, lang)}
        </span>
        <h1 className="mt-4">{content.title}</h1>
        <p className="mt-5 text-[17px] leading-relaxed max-w-[680px] line-clamp-3">{content.summary}</p>
        <div className="mt-6 flex items-center gap-4 text-sm text-white/70">
          <span>{formatDate(article.publishedAt, lang)}</span>
          <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
            {lang === "ko" ? "기사 읽기" : "Read the story"} <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
