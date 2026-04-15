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

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">PSA</span>
            <span className="hidden sm:block text-sm text-muted-foreground">
              {dict.siteTagline}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} />
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } md:block border-t border-border md:border-0 pb-3 md:pb-0`}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0 md:h-10">
            <li>
              <Link
                href={`/${lang}`}
                className={`block px-3 py-2 md:py-0 text-sm font-medium rounded-lg md:rounded-none hover:bg-muted md:hover:bg-transparent md:hover:text-accent transition-colors ${
                  pathname === `/${lang}`
                    ? "text-accent bg-muted md:bg-transparent"
                    : "text-muted-foreground"
                }`}
              >
                {dict.nav.home}
              </Link>
            </li>
            {siteConfig.categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${lang}/category/${cat.slug}`}
                  className={`block px-3 py-2 md:py-0 text-sm font-medium rounded-lg md:rounded-none hover:bg-muted md:hover:bg-transparent md:hover:text-accent transition-colors ${
                    pathname === `/${lang}/category/${cat.slug}`
                      ? "text-accent bg-muted md:bg-transparent"
                      : "text-muted-foreground"
                  }`}
                >
                  {getCategoryLabel(cat.slug as any, lang)}
                </Link>
              </li>
            ))}
            <li className="md:ml-auto">
              <Link
                href={`/${lang}/search`}
                className="flex items-center gap-1 px-3 py-2 md:py-0 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {dict.nav.search}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
