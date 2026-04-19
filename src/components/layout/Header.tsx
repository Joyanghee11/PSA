"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/types";
import type { Dictionary } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AuthMenu } from "./AuthMenu";
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
          <div className="flex items-center gap-3">
            <AuthMenu lang={lang} />
            <span className="text-border">·</span>
            <LanguageSwitcher lang={lang} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-card">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="flex flex-col items-start leading-none select-none"
            aria-label="다이브 저널 · DiveJournal"
          >
            {/* Korean main title — Gowun Batang 감성 명조 */}
            <span
              className="font-headline text-headline"
              style={{
                fontSize: "38px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              다이브 저널
            </span>
            {/* English subtitle — refined letter-spacing, thin divider */}
            <span
              className="text-muted-foreground mt-2 flex items-center"
              style={{
                fontSize: "10px",
                letterSpacing: "0.45em",
                fontWeight: 500,
                fontFamily: "var(--font-sans), sans-serif",
              }}
            >
              <span style={{ color: "var(--headline)", fontWeight: 600 }}>DIVE</span>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "18px",
                  borderTop: "1px solid var(--border)",
                  margin: "0 8px",
                }}
              />
              <span
                style={{
                  fontStyle: "italic",
                  fontFamily: "var(--font-serif), serif",
                  color: "var(--accent)",
                  letterSpacing: "0.2em",
                }}
              >
                journal
              </span>
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

      {/* Nav — Korean main + English sub per category */}
      <nav className="border-b-thin bg-nav-bg text-nav-text">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Mobile toggle */}
          <div className="md:hidden flex items-center justify-between h-12">
            <Link
              href={`/${lang}`}
              className="font-headline"
              style={{ fontSize: "16px", fontWeight: 700 }}
            >
              전체 기사
            </Link>
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

          <ul
            className={`${menuOpen ? "block pb-3" : "hidden"} md:flex md:items-stretch md:flex-nowrap md:justify-center md:py-2.5`}
          >
            {/* Home */}
            <li className="md:flex">
              <Link
                href={`/${lang}`}
                className={`group flex flex-col items-start md:items-center px-3 py-2 md:px-2.5 md:py-1 border-l-0 md:border-r border-border whitespace-nowrap ${pathname === `/${lang}` ? "text-accent" : "hover:text-accent"}`}
              >
                <span
                  className="font-headline"
                  style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
                >
                  전체
                </span>
                <span
                  className="text-muted-foreground group-hover:text-accent mt-0.5"
                  style={{
                    fontSize: "8px",
                    letterSpacing: "0.15em",
                    fontFamily: "var(--font-sans), sans-serif",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Home
                </span>
              </Link>
            </li>

            {/* All categories */}
            {siteConfig.categories.map((cat) => {
              const isActive = pathname.includes(`/category/${cat.slug}`);
              return (
                <li key={cat.slug} className="md:flex">
                  <Link
                    href={`/${lang}/category/${cat.slug}`}
                    className={`group flex flex-col items-start md:items-center px-3 py-2 md:px-2.5 md:py-1 border-r border-border last:border-r-0 whitespace-nowrap ${isActive ? "text-accent" : "hover:text-accent"}`}
                  >
                    <span
                      className="font-headline"
                      style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
                    >
                      {cat.label.ko}
                    </span>
                    <span
                      className="text-muted-foreground group-hover:text-accent mt-0.5"
                      style={{
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                        fontFamily: "var(--font-sans), sans-serif",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {cat.label.en}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
