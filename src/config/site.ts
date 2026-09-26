export const siteConfig = {
  name: "다이브 저널",
  nameEn: "Dive Journal",
  description: "프리다이빙·스쿠버·수중 사진 웹 매거진",
  descriptionEn: "A web magazine of freediving, scuba and underwater photography",
  url: "https://divejournal.co.kr",
  defaultLang: "ko" as const,

  categories: [
    { slug: "freediving", label: { en: "Freediving", ko: "프리다이빙" } },
    { slug: "scuba-news", label: { en: "Scuba", ko: "스쿠버" } },
    { slug: "competition", label: { en: "Competition", ko: "대회" } },
    { slug: "equipment", label: { en: "Equipment", ko: "장비" } },
    { slug: "environment", label: { en: "Environment", ko: "환경" } },
    { slug: "people", label: { en: "People", ko: "인물" } },
    { slug: "science", label: { en: "Science", ko: "과학" } },
    { slug: "diving-spot", label: { en: "Diving Spots", ko: "다이빙 포인트" } },
    { slug: "recipe", label: { en: "Diver's Kitchen", ko: "다이버 식단" } },
    { slug: "workout", label: { en: "Training Tips", ko: "트레이닝" } },
    { slug: "video", label: { en: "Video", ko: "영상" } },
  ],
} as const;
