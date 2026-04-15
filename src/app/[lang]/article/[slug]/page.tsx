import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { getArticleBySlug, getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/article/CategoryBadge";
import { getDictionary } from "@/config/i18n";

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
  const article = getArticleBySlug(slug);
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
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const dict = getDictionary(lang as Lang);
  const content = article[lang as Lang];

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={article.category} lang={lang as Lang} />
          <time className="text-sm text-muted-foreground">
            {formatDate(article.publishedAt, lang as Lang)}
          </time>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {content.title}
        </h1>
        <p className="text-lg text-muted-foreground">{content.summary}</p>
      </div>

      {article.imageUrl && (
        <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-muted">
          <img
            src={article.imageUrl}
            alt={article.imageAlt || content.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />

      {article.sourceUrls.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
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
        </div>
      )}

      {article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
