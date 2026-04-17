export const siteConfig = {
  name: "다이브 저널",
  nameEn: "Dive Journal",
  description: "전 세계 프리다이빙·스쿠버 소식을 전하는 AI 인터넷 신문",
  descriptionEn: "AI-powered worldwide diving news",
  url: "https://divejournal.co.kr",
  defaultLang: "ko" as const,

  // 메인 섹션 (네비게이션에 표시)
  sections: [
    {
      slug: "freediving",
      label: { en: "Freediving", ko: "프리다이빙" },
      categories: ["freediving-competition", "freediving-records", "freediving-training", "freediving-safety"],
    },
    {
      slug: "scuba",
      label: { en: "Scuba", ko: "스쿠버" },
      categories: ["scuba-news", "scuba-equipment", "scuba-destination"],
    },
  ],

  // 전체 카테고리
  categories: [
    // 프리다이빙
    { slug: "freediving-competition", label: { en: "Competition", ko: "프리다이빙 대회" }, section: "freediving" },
    { slug: "freediving-records", label: { en: "Records", ko: "프리다이빙 기록" }, section: "freediving" },
    { slug: "freediving-training", label: { en: "Training", ko: "프리다이빙 훈련" }, section: "freediving" },
    { slug: "freediving-safety", label: { en: "Safety", ko: "프리다이빙 안전" }, section: "freediving" },
    // 스쿠버
    { slug: "scuba-news", label: { en: "Scuba News", ko: "스쿠버 뉴스" }, section: "scuba" },
    { slug: "scuba-equipment", label: { en: "Scuba Gear", ko: "스쿠버 장비" }, section: "scuba" },
    { slug: "scuba-destination", label: { en: "Scuba Destination", ko: "스쿠버 여행지" }, section: "scuba" },
    // 공통
    { slug: "science", label: { en: "Science", ko: "과학" }, section: "common" },
    { slug: "environment", label: { en: "Environment", ko: "환경" }, section: "common" },
    { slug: "people", label: { en: "People", ko: "인물" }, section: "common" },
    { slug: "diving-spot", label: { en: "Diving Spots", ko: "다이빙 포인트" }, section: "common" },
    { slug: "recipe", label: { en: "Diver's Kitchen", ko: "다이버 식단" }, section: "common" },
    { slug: "workout", label: { en: "Training Tips", ko: "트레이닝" }, section: "common" },
    { slug: "video", label: { en: "Video", ko: "영상" }, section: "common" },
    // 레거시 호환
    { slug: "competition", label: { en: "Competition", ko: "대회" }, section: "legacy" },
    { slug: "records", label: { en: "Records", ko: "기록" }, section: "legacy" },
    { slug: "training", label: { en: "Training", ko: "훈련" }, section: "legacy" },
    { slug: "safety", label: { en: "Safety", ko: "안전" }, section: "legacy" },
    { slug: "equipment", label: { en: "Equipment", ko: "장비" }, section: "legacy" },
  ],
} as const;
