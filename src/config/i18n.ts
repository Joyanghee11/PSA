import type { Lang } from "@/lib/types";

export const locales: Lang[] = ["ko", "en"];
export const defaultLocale: Lang = "ko";

const dictionaries = {
  ko: {
    siteName: "PSA - Planet Sea & Apnea",
    siteTagline: "\uc804 \uc138\uacc4 \ud504\ub9ac\ub2e4\uc774\ube59 \ub274\uc2a4",
    nav: {
      home: "\ud648",
      categories: "\uce74\ud14c\uace0\ub9ac",
      search: "\uac80\uc0c9",
      about: "\uc18c\uac1c",
    },
    article: {
      readMore: "\ub354 \uc77d\uae30",
      source: "\ucd9c\ucc98",
      publishedAt: "\ubc1c\ud589\uc77c",
      relatedArticles: "\uad00\ub828 \uae30\uc0ac",
      latestNews: "\ucd5c\uc2e0 \ub274\uc2a4",
      featured: "\uc8fc\uc694 \uae30\uc0ac",
      noArticles: "\uae30\uc0ac\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.",
    },
    search: {
      placeholder: "\uae30\uc0ac \uac80\uc0c9...",
      noResults: "\uac80\uc0c9 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.",
    },
    footer: {
      copyright: "\xa9 2026 PSA. AI\ub85c \uc0dd\uc131\ub41c \ud504\ub9ac\ub2e4\uc774\ube59 \ub274\uc2a4.",
      poweredBy: "Claude AI \uae30\ubc18",
    },
  },
  en: {
    siteName: "PSA - Planet Sea & Apnea",
    siteTagline: "Worldwide Freediving News",
    nav: {
      home: "Home",
      categories: "Categories",
      search: "Search",
      about: "About",
    },
    article: {
      readMore: "Read more",
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
      copyright: "\xa9 2026 PSA. AI-generated freediving news.",
      poweredBy: "Powered by Claude AI",
    },
  },
};

export type Dictionary = (typeof dictionaries)["ko"];

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? dictionaries[defaultLocale];
}
