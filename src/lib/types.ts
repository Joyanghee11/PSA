export type Category =
  | "freediving"
  // 레거시 프리다이빙
  | "freediving-competition"
  | "freediving-records"
  | "freediving-training"
  | "freediving-safety"
  // 스쿠버
  | "scuba-news"
  | "scuba-equipment"
  | "scuba-destination"
  // 공통
  | "science"
  | "environment"
  | "people"
  | "diving-spot"
  | "recipe"
  | "workout"
  | "video"
  // 레거시 (기존 기사 호환)
  | "competition"
  | "records"
  | "training"
  | "safety"
  | "equipment";

export type Lang = "ko" | "en";

export interface LocalizedContent {
  title: string;
  summary: string;
  body: string;
  metaDescription: string;
}

export interface ArticleEvaluation {
  score: number; // 0-100
  gate: "pass" | "fail";
  evaluatedAt: string; // ISO timestamp
  notes?: string; // brief reason / failure summary
  breakdown?: {
    contentIntegrity: number; // out of 30
    languageQuality: number; // out of 25
    structureFormat: number; // out of 15
    seoMetadata: number; // out of 10
    domainValue: number; // out of 10
    safetyEthics: number; // out of 10
  };
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
  pinned?: "top" | "featured" | undefined;
  evaluation?: ArticleEvaluation;
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
