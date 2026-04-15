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

export function getCategoryLabel(
  category: Category,
  lang: Lang
): string {
  const labels: Record<Category, Record<Lang, string>> = {
    competition: { en: "Competition", ko: "\ub300\ud68c" },
    records: { en: "Records", ko: "\uae30\ub85d" },
    training: { en: "Training", ko: "\ud6c8\ub828" },
    safety: { en: "Safety", ko: "\uc548\uc804" },
    equipment: { en: "Equipment", ko: "\uc7a5\ube44" },
    science: { en: "Science", ko: "\uacfc\ud559" },
    environment: { en: "Environment", ko: "\ud658\uacbd" },
    people: { en: "People", ko: "\uc778\ubb3c" },
    "diving-spot": { en: "Diving Spots", ko: "\ub2e4\uc774\ube59 \ud3ec\uc778\ud2b8" },
    recipe: { en: "Diver's Kitchen", ko: "\ub2e4\uc774\ubc84 \uc2dd\ub2e8" },
    workout: { en: "Training Tips", ko: "\ud2b8\ub808\uc774\ub2dd" },
    video: { en: "Video", ko: "\uc601\uc0c1" },
  };
  return labels[category]?.[lang] ?? category;
}

export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    competition: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    records: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    training: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    safety: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    equipment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    science: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    environment: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    people: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    "diving-spot": "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    recipe: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    workout: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
    video: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[category] ?? "";
}
