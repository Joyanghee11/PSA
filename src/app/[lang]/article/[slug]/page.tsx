import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { getArticleBySlugAsync, getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/article/CategoryBadge";
import { getDictionary } from "@/config/i18n";
import { AdSlot } from "@/components/ads/AdBanner";
import CommentSection from "@/components/comments/CommentSection";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const articles = getAllArticles();
  const params: { lang: string; slug: string }[] = [];
  for (const article of articles) {
    params.push({ lang: "ko", slug: article.slug });
    params.push({ lang: "en", slug: article.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await getArticleBySlugAsync(slug);
  if (!article) return { title: "Not Found" };

  const content = article[lang as Lang];
  return {
    title: content.title,
    description: content.metaDescription,
    openGraph: {
      title: content.title,
      description: content.metaDescription,
      type: "article",
      publishedTime: article.publishedAt,
      ...(article.imageUrl && { images: [article.imageUrl] }),
    },
    alternates: {
      languages: {
        ko: `/ko/article/${slug}`,
        en: `/en/article/${slug}`,
      },
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = await getArticleBySlugAsync(slug);
  if (!article) notFound();

  const dict = getDictionary(lang as Lang);
  const content = article[lang as Lang];

  return (
    <article>
      {/* Header */}
      <header className="max-w-[860px] mx-auto text-center mb-10 rise">
        <span className="kicker justify-center"><CategoryBadge category={article.category} lang={lang as Lang} /></span>
        <h1 className="font-headline text-[34px] md:text-[54px] leading-[1.08] mt-5">{content.title}</h1>
        <p className="text-[19px] text-muted-foreground leading-relaxed mt-6 max-w-[720px] mx-auto">{content.summary}</p>
        <div className="flex items-center justify-center gap-3 mt-7 text-sm text-muted-foreground">
          <time>{formatDate(article.publishedAt, lang as Lang)}</time>
          <span aria-hidden>·</span>
          <span className="font-italic-serif">{lang === "ko" ? "다이브 저널" : "Dive Journal"}</span>
        </div>
      </header>

      {/* Image */}
      {article.imageUrl && (
        <figure className="max-w-[1100px] mx-auto mb-12 rise rise-2">
          <div className="aspect-[16/9] overflow-hidden rounded-[22px] bg-muted shadow-[var(--shadow-3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt={article.imageAlt || content.title} className="w-full h-full object-cover" />
          </div>
          {article.imageAlt && <figcaption className="text-xs text-muted-foreground mt-3 text-center">{article.imageAlt}</figcaption>}
        </figure>
      )}

      <div className="max-w-[720px] mx-auto">
      {/* Ad: article top */}
      <AdSlot position="article-top" />

      {/* Body */}
      <div
        className="prose prose-lg max-w-none dropcap prose-headings:font-headline prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />

      {/* Ad: article bottom */}
      <AdSlot position="article-bottom" />

      {/* Source */}
      {article.sourceUrls.length > 0 && (
        <aside className="mt-10 pt-6 border-t border-border">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {dict.article.source}
          </h3>
          <ul className="space-y-1">
            {article.sourceUrls.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline break-all"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments */}
      <CommentSection slug={article.slug} />
      </div>
    </article>
  );
}
