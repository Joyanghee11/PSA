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

  // 프리다이빙 카테고리는 레거시 카테고리도 포함
  const freedivingCats = ["freediving", "freediving-competition", "freediving-records", "freediving-training", "freediving-safety"];
  const equipmentCats = ["equipment", "scuba-equipment"];
  const competitionCats = ["competition", "freediving-competition"];

  let articles;
  if (category === "freediving") {
    articles = allArticles.filter((a) => freedivingCats.includes(a.category) || a.category === "records" || a.category === "training" || a.category === "safety");
  } else if (category === "equipment") {
    articles = allArticles.filter((a) => equipmentCats.includes(a.category));
  } else if (category === "competition") {
    articles = allArticles.filter((a) => competitionCats.includes(a.category));
  } else if (category === "scuba-news") {
    articles = allArticles.filter((a) => a.category === "scuba-news" || a.category === "scuba-destination");
  } else {
    articles = allArticles.filter((a) => a.category === category);
  }
  const label = getCategoryLabel(category as Category, lang as Lang);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{label}</h1>
      <ArticleList articles={articles} lang={lang as Lang} />
    </div>
  );
}
