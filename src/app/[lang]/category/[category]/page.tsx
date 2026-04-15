import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Lang, Category } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/config/i18n";
import { getArticlesByCategory } from "@/lib/content";
import { getCategoryLabel } from "@/lib/utils";
import { ArticleList } from "@/components/article/ArticleList";

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
        ? `${label} \uad00\ub828 \ud504\ub9ac\ub2e4\uc774\ube59 \ub274\uc2a4`
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
  const articles = getArticlesByCategory(category as Category);
  const label = getCategoryLabel(category as Category, lang as Lang);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{label}</h1>
      <ArticleList articles={articles} lang={lang as Lang} />
    </div>
  );
}
