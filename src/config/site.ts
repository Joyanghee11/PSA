export const siteConfig = {
  name: "PSA - Planet Sea & Apnea",
  description: "Your daily source for worldwide freediving news",
  url: "https://psa-news.vercel.app",
  defaultLang: "ko" as const,
  categories: [
    { slug: "competition", label: { en: "Competition", ko: "\ub300\ud68c" } },
    { slug: "records", label: { en: "Records", ko: "\uae30\ub85d" } },
    { slug: "training", label: { en: "Training", ko: "\ud6c8\ub828" } },
    { slug: "safety", label: { en: "Safety", ko: "\uc548\uc804" } },
    { slug: "equipment", label: { en: "Equipment", ko: "\uc7a5\ube44" } },
    { slug: "science", label: { en: "Science", ko: "\uacfc\ud559" } },
    { slug: "environment", label: { en: "Environment", ko: "\ud658\uacbd" } },
    { slug: "people", label: { en: "People", ko: "\uc778\ubb3c" } },
  ],
} as const;
