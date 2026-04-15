import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Lang, Category } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/config/i18n";
import { getAllArticlesAsync } from "@/lib/content";
import { getCategoryLabel } from "@/lib/utils";
import { ArticleList } from "@/components/article/ArticleList";

export const dynamic = "force-dynamic";

const validCategories: string[] = siteConfig.categories.map((c) => c.slug);

export function generateStaticParams() {
  const params: { lang: string; category: string }[] = [];
  for (const cat of validCategories) {
    params.push({ lang: "ko", category: cat });
    params.push({ lang: "en", category: cat });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}): Promise<Metadata> {
  const { lang, category } = await params;
  if (!validCategories.includes(category)) return { title: "Not Found" };
  const label = getCategoryLabel(category as Category, lang as Lang);
  return {
    title: label,
    description:
      lang === "ko"
        ? `${label} 관련 프리다이빙 뉴스`
        : `Freediving news about ${label}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category } = await params;

  if (!validCategories.includes(category)) {
    notFound();
  }

  const dict = getDictionary(lang as Lang);
  const allArticles = await getAllArticlesAsync();
  const articles = allArticles.filter((a) => a.category === category);
  const label = getCategoryLabel(category as Category, lang as Lang);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{label}</h1>
      <ArticleList articles={articles} lang={lang as Lang} />
    </div>
  );
}
