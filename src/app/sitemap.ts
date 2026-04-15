import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const articles = getAllArticles();

  const articleUrls = articles.flatMap((article) => [
    {
      url: `${baseUrl}/ko/article/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/article/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  const categoryUrls = siteConfig.categories.flatMap((cat) => [
    {
      url: `${baseUrl}/ko/category/${cat.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/category/${cat.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
  ]);

  return [
    {
      url: `${baseUrl}/ko`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
