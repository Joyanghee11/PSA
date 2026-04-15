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

function TodayDate({ lang }: { lang: Lang }) {
  const now = new Date();
  if (lang === "ko") {
    return (
      <span>
        {now.getFullYear()}년 {now.getMonth() + 1}월 {now.getDate()}일{" "}
        {["일", "월", "화", "수", "목", "금", "토"][now.getDay()]}요일
      </span>
    );
  }
  return (
    <span>
      {now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </span>
  );
}

export function Header({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-card">
      {/* Top utility bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-xs text-muted-foreground">
          <TodayDate lang={lang} />
          <div className="flex items-center gap-3">
            <LanguageSwitcher lang={lang} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="border-b-[3px] border-border-strong">
        <div className="max-w-7xl mx-auto px-4 py-5 text-center">
          <Link href={`/${lang}`}>
            <h1 className="text-4xl md:text-5xl font-headline tracking-tight">
              {lang === "ko" ? "다이브 저널" : "Dive Journal"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 tracking-wide">
              {dict.siteTagline}
            </p>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile toggle */}
          <div className="md:hidden flex items-center justify-between h-11">
            <span className="text-sm font-semibold">{dict.nav.categories}</span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className={`${menuOpen ? "block pb-3" : "hidden"} md:block`}>
            <ul className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-0 md:h-11">
              <li>
                <Link
                  href={`/${lang}`}
                  className={`block px-4 py-2 md:py-0 text-sm font-medium border-b md:border-b-0 md:border-b-2 transition-colors ${
                    pathname === `/${lang}`
                      ? "text-accent border-accent"
                      : "text-foreground border-transparent hover:text-accent"
                  }`}
                >
                  {dict.nav.home}
                </Link>
              </li>
              {siteConfig.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${lang}/category/${cat.slug}`}
                    className={`block px-4 py-2 md:py-0 text-sm font-medium border-b md:border-b-0 md:border-b-2 transition-colors ${
                      pathname === `/${lang}/category/${cat.slug}`
                        ? "text-accent border-accent"
                        : "text-foreground border-transparent hover:text-accent"
                    }`}
                  >
                    {getCategoryLabel(cat.slug as any, lang)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${lang}/search`}
                  className="flex items-center gap-1 px-4 py-2 md:py-0 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {dict.nav.search}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
