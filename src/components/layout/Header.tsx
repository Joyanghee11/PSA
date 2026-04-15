"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/types";
import type { Dictionary } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState } from "react";

export function Header({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const now = new Date();
  const dateStr =
    lang === "ko"
      ? `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${["일", "월", "화", "수", "목", "금", "토"][now.getDay()]}요일`
      : now.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  return (
    <header>
      {/* Top bar */}
      <div className="bg-muted border-b-thin">
        <div className="max-w-[1200px] mx-auto px-4 h-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>{dateStr}</span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-card">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-black tracking-tight text-accent">
              {lang === "ko" ? "다이브저널" : "DiveJournal"}
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-medium tracking-wide">
              {lang === "ko" ? "DIVE JOURNAL" : "다이브저널"}
            </span>
          </Link>
          <Link
            href={`/${lang}/search`}
            className="flex items-center gap-1 px-3 py-1.5 border border-border rounded text-sm text-muted-foreground hover:border-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">{dict.nav.search}</span>
          </Link>
        </div>
      </div>

      {/* Main nav - dark background like hani.co.kr */}
      <nav className="bg-nav-bg text-nav-text">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Mobile */}
          <div className="md:hidden flex items-center justify-between h-10">
            <Link href={`/${lang}`} className="text-sm font-bold">{dict.nav.home}</Link>
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop + mobile expanded */}
          <ul className={`${menuOpen ? "block pb-2" : "hidden"} md:flex md:items-center md:h-11 md:gap-0`}>
            <li>
              <Link
                href={`/${lang}`}
                className={`block px-4 py-2 md:py-0 text-sm font-medium transition-colors hover:text-accent ${
                  pathname === `/${lang}` ? "text-accent" : ""
                }`}
              >
                {dict.nav.home}
              </Link>
            </li>
            {siteConfig.categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${lang}/category/${cat.slug}`}
                  className={`block px-4 py-2 md:py-0 text-sm font-medium transition-colors hover:text-accent ${
                    pathname.includes(`/category/${cat.slug}`) ? "text-accent" : ""
                  }`}
                >
                  {getCategoryLabel(cat.slug as any, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
