import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { getArticleBySlugAsync, getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/article/CategoryBadge";
import { getDictionary } from "@/config/i18n";

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
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={article.category} lang={lang as Lang} />
        </div>
        <h1 className="text-3xl md:text-[2.5rem] font-headline leading-tight mb-4">
          {content.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {content.summary}
        </p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <time className="text-sm text-muted-foreground">
            {formatDate(article.publishedAt, lang as Lang)}
          </time>
          <span className="text-sm text-muted-foreground">
            {lang === "ko" ? "다이브 저널" : "Dive Journal"}
          </span>
        </div>
      </header>

      {/* Image */}
      {article.imageUrl && (
        <figure className="mb-8">
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={article.imageUrl}
              alt={article.imageAlt || content.title}
              className="w-full h-full object-cover"
            />
          </div>
          {article.imageAlt && (
            <figcaption className="text-xs text-muted-foreground mt-2 text-center">
              {article.imageAlt}
            </figcaption>
          )}
        </figure>
      )}

      {/* Body */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-p:leading-relaxed prose-p:text-foreground/90"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />

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
    </article>
  );
}
