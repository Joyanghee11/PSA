export type Category =
  | "competition"
  | "records"
  | "training"
  | "safety"
  | "equipment"
  | "science"
  | "environment"
  | "people";

export type Lang = "ko" | "en";

export interface LocalizedContent {
  title: string;
  summary: string;
  body: string;
  metaDescription: string;
}

export interface Article {
  slug: string;
  publishedAt: string;
  updatedAt: string;
  status: "draft" | "published";
  category: Category;
  tags: string[];
  sourceUrls: string[];
  en: LocalizedContent;
  ko: LocalizedContent;
  imageUrl?: string;
  imageAlt?: string;
}

export interface RawNewsItem {
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
  source: string;
}

export interface ProcessedNewsItem extends RawNewsItem {
  normalizedTitle: string;
  relevanceScore: number;
}
