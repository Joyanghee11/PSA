"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/types";

export function LanguageSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const otherLang: Lang = lang === "ko" ? "en" : "ko";
  const newPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  return (
    <Link
      href={newPath}
      className="px-2 py-1 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors"
    >
      {otherLang === "ko" ? "\ud55c\uad6d\uc5b4" : "EN"}
    </Link>
  );
}
