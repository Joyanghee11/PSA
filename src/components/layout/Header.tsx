"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import type { Lang } from "@/lib/types";
import type { Dictionary } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AuthMenu } from "./AuthMenu";

// Section color-coding: encodes section, never decoration.
// Colored sections sign with their accent; neutral sections fall to the
// signature dark-red (--accent) on active, keeping the resting rail calm.
const SECTION_COLOR: Record<string, string> = {
  freediving: "var(--accent-blue)",
  "scuba-news": "var(--accent-teal)",
  science: "var(--accent-blue)",
  "diving-spot": "var(--accent-blue)",
  equipment: "var(--accent-warm)",
  recipe: "var(--accent-warm)",
};

export function Header({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const pathname = usePathname();

  const now = new Date();
  const dateStr =
    lang === "ko"
      ? `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} · ${["일", "월", "화", "수", "목", "금", "토"][now.getDay()]}`
      : now.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  return (
    <header>
      {/* Signature broadsheet masthead rule */}
      <div className="masthead-rule" />

      {/* Utility strip */}
      <div className="bg-nav-bg border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 h-9 flex items-center justify-between">
          <span className="dateline">{dateStr}</span>
          <div className="flex items-center gap-3 text-xs">
            <AuthMenu lang={lang} />
            <span className="text-border">·</span>
            <LanguageSwitcher lang={lang} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Nameplate */}
      <div className="bg-nav-bg masthead-hairline">
        <div className="max-w-[1200px] mx-auto px-4 pt-3.5 pb-2.5 flex items-end justify-between gap-4">
          <Link
            href={`/${lang}`}
            className="flex items-end gap-3 leading-none select-none"
            aria-label="다이브 저널 · DiveJournal"
          >
            <span
              className="font-headline text-headline"
              style={{ fontSize: "30px", fontWeight: 600, letterSpacing: "-0.5px", lineHeight: 1 }}
            >
              다이브 저널
            </span>
            <span
              className="hidden sm:inline pb-0.5 text-muted-foreground"
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "3px",
              }}
            >
              <span style={{ color: "var(--headline)" }}>DIVE</span>{" "}
              <span style={{ textTransform: "lowercase" }}>journal</span>
            </span>
          </Link>

          <div className="flex items-end gap-4">
            <span className="hidden md:inline nameplate-tagline pb-1">바다를 정확하게</span>
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
      </div>

      {/* Category index — single dense scrollable row, all 12 categories */}
      <nav aria-label="카테고리">
        <div className="max-w-[1200px] mx-auto">
          <div className="nav-index px-2">
            {/* Home */}
            <Link
              href={`/${lang}`}
              className="nav-item"
              aria-current={pathname === `/${lang}` ? "page" : undefined}
            >
              <span className="ko">전체</span>
              <span className="en">ALL</span>
            </Link>

            {/* All categories */}
            {siteConfig.categories.map((cat) => {
              const isActive = pathname.includes(`/category/${cat.slug}`);
              const secColor = SECTION_COLOR[cat.slug];
              const style = secColor
                ? ({ ["--seccolor"]: secColor } as CSSProperties)
                : undefined;
              return (
                <Link
                  key={cat.slug}
                  href={`/${lang}/category/${cat.slug}`}
                  className="nav-item"
                  aria-current={isActive ? "page" : undefined}
                  style={style}
                >
                  <span className="ko">{cat.label.ko}</span>
                  <span className="en">{cat.label.en}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
