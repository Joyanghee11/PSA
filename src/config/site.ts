export const siteConfig = {
  name: "다이브 저널",
  nameEn: "Dive Journal",
  description: "전 세계 프리다이빙 소식을 전하는 AI 인터넷 신문",
  descriptionEn: "AI-powered worldwide freediving news",
  url: "https://divejournal.co.kr",
  defaultLang: "ko" as const,
  categories: [
    { slug: "competition", label: { en: "Competition", ko: "대회" } },
    { slug: "records", label: { en: "Records", ko: "기록" } },
    { slug: "training", label: { en: "Training", ko: "훈련" } },
    { slug: "safety", label: { en: "Safety", ko: "안전" } },
    { slug: "equipment", label: { en: "Equipment", ko: "장비" } },
    { slug: "science", label: { en: "Science", ko: "과학" } },
    { slug: "environment", label: { en: "Environment", ko: "환경" } },
    { slug: "people", label: { en: "People", ko: "인물" } },
  ],
} as const;
