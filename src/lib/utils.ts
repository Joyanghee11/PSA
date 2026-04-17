import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import slugifyLib from "slugify";
import type { Lang, Category } from "./types";

export function createSlug(title: string): string {
  return slugifyLib(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function formatDate(dateStr: string, lang: Lang): string {
  const date = parseISO(dateStr);
  const locale = lang === "ko" ? ko : enUS;
  return format(date, lang === "ko" ? "yyyy\ub144 M\uc6d4 d\uc77c" : "MMMM d, yyyy", {
    locale,
  });
}

export function formatRelativeDate(dateStr: string, lang: Lang): string {
  const date = parseISO(dateStr);
  const locale = lang === "ko" ? ko : enUS;
  return formatDistanceToNow(date, { addSuffix: true, locale });
}

const categoryLabels: Record<string, Record<Lang, string>> = {
  // 프리다이빙
  "freediving-competition": { en: "Competition", ko: "프리다이빙 대회" },
  "freediving-records": { en: "Records", ko: "프리다이빙 기록" },
  "freediving-training": { en: "Training", ko: "프리다이빙 훈련" },
  "freediving-safety": { en: "Safety", ko: "프리다이빙 안전" },
  // 스쿠버
  "scuba-news": { en: "Scuba News", ko: "스쿠버 뉴스" },
  "scuba-equipment": { en: "Scuba Gear", ko: "스쿠버 장비" },
  "scuba-destination": { en: "Scuba Destination", ko: "스쿠버 여행지" },
  // 공통
  science: { en: "Science", ko: "과학" },
  environment: { en: "Environment", ko: "환경" },
  people: { en: "People", ko: "인물" },
  "diving-spot": { en: "Diving Spots", ko: "다이빙 포인트" },
  recipe: { en: "Diver's Kitchen", ko: "다이버 식단" },
  workout: { en: "Training Tips", ko: "트레이닝" },
  video: { en: "Video", ko: "영상" },
  // 레거시
  competition: { en: "Competition", ko: "대회" },
  records: { en: "Records", ko: "기록" },
  training: { en: "Training", ko: "훈련" },
  safety: { en: "Safety", ko: "안전" },
  equipment: { en: "Equipment", ko: "장비" },
};

export function getCategoryLabel(category: Category, lang: Lang): string {
  return categoryLabels[category]?.[lang] ?? category;
}

export function getCategoryColor(category: Category): string {
  const colors: Record<string, string> = {
    "freediving-competition": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "freediving-records": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    "freediving-training": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "freediving-safety": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "scuba-news": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    "scuba-equipment": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
    "scuba-destination": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    science: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    environment: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    people: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    "diving-spot": "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    recipe: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    workout: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
    video: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    // 레거시
    competition: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    records: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    training: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    safety: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    equipment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };
  return colors[category] ?? "";
}
