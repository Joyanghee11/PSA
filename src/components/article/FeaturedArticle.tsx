import Link from "next/link";
import type { Article, Lang } from "@/lib/types";
import { formatDate, getCategoryLabel } from "@/lib/utils";

/** 커버 스토리: 흰 지면 위에 글(왼쪽)과 사진(오른쪽)을 나란히. 좁은 화면에서는 사진이 위로 간다. */
export function FeaturedArticle({ article, lang }: { article: Article; lang: Lang }) {
  const content = article[lang];
  const href = `/${lang}/article/${article.slug}`;

  return (
    <Link href={href} className="cover-story group rise">
      {article.imageUrl && (
        <div className="cover-story__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.imageUrl} alt={article.imageAlt || content.title} fetchPriority="high" />
        </div>
      )}
      <div className="cover-story__body">
        <span className="kicker">
          {lang === "ko" ? "커버 스토리" : "Cover story"} · {getCategoryLabel(article.category, lang)}
        </span>
        <h1 className="font-headline cover-story__title group-hover:text-accent transition-colors">{content.title}</h1>
        {content.summary && <p className="cover-story__lead">{content.summary}</p>}
        <span className="dateline">{formatDate(article.publishedAt, lang)}</span>
      </div>
    </Link>
  );
}
