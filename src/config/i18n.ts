import type { Lang } from "@/lib/types";

export const locales: Lang[] = ["ko", "en"];
export const defaultLocale: Lang = "ko";

const dictionaries = {
  ko: {
    siteName: "다이브 저널",
    siteTagline: "전 세계 프리다이빙 소식을 전하는 AI 인터넷 신문",
    nav: {
      home: "홈",
      categories: "카테고리",
      search: "검색",
      about: "소개",
    },
    article: {
      readMore: "기사 전문 보기",
      source: "출처",
      publishedAt: "발행일",
      relatedArticles: "관련 기사",
      latestNews: "최신 뉴스",
      featured: "주요 기사",
      noArticles: "기사가 없습니다.",
    },
    search: {
      placeholder: "기사 검색...",
      noResults: "검색 결과가 없습니다.",
    },
    footer: {
      copyright: "© 2026 다이브 저널. AI로 생성된 프리다이빙 뉴스.",
      poweredBy: "Powered by Claude AI",
    },
  },
  en: {
    siteName: "Dive Journal",
    siteTagline: "AI-powered worldwide freediving news",
    nav: {
      home: "Home",
      categories: "Categories",
      search: "Search",
      about: "About",
    },
    article: {
      readMore: "Read full article",
      source: "Source",
      publishedAt: "Published",
      relatedArticles: "Related Articles",
      latestNews: "Latest News",
      featured: "Featured",
      noArticles: "No articles found.",
    },
    search: {
      placeholder: "Search articles...",
      noResults: "No results found.",
    },
    footer: {
      copyright: "© 2026 Dive Journal. AI-generated freediving news.",
      poweredBy: "Powered by Claude AI",
    },
  },
};

export type Dictionary = (typeof dictionaries)["ko"];

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? dictionaries[defaultLocale];
}
