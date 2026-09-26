"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/types";
import type { Dictionary } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AuthMenu } from "./AuthMenu";

export function Header({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const pathname = usePathname() ?? "";
  const ko = lang === "ko";

  const primary = [
    { href: `/${lang}`, label: ko ? "저널" : "Journal", match: (p: string) => p === `/${lang}` || p.includes("/article/") || p.includes("/category/") },
    { href: `/${lang}/gallery`, label: ko ? "갤러리" : "Gallery", match: (p: string) => p.startsWith(`/${lang}/gallery`) },
    { href: `/${lang}/contest`, label: ko ? "콘테스트" : "Contest", match: (p: string) => p.startsWith(`/${lang}/contest`) },
    { href: `/${lang}/about`, label: ko ? "소개" : "About", match: (p: string) => p.startsWith(`/${lang}/about`) },
  ];
  // 카테고리 줄은 기사를 읽는 화면에서만 보인다. 갤러리·콘테스트는 자기 탐색을 쓴다.
  const showRail = primary[0].match(pathname);

  const now = new Date();
  const issue = ko
    ? `${now.getFullYear()}년 ${now.getMonth() + 1}월호`
    : now.toLocaleDateString("en-US", { month: "long", year: "numeric" }) + " Issue";

  return (
    <header className="mag-header">
      <div className="masthead-rule" />
      <div className="mag-container">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <Link href={`/${lang}`} className="flex items-center select-none shrink-0" aria-label="다이브 저널 · Dive Journal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-navy-h120.png" alt="DIVE JOURNAL 다이브저널" width={215} height={120} className="brand-logo brand-logo--navy h-[46px] md:h-[52px] w-auto" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-light-h120.png" alt="" aria-hidden width={215} height={120} className="brand-logo brand-logo--light h-[46px] md:h-[52px] w-auto" />
          </Link>

          <nav className="primary-nav hidden md:flex items-center gap-7" aria-label={ko ? "주요 메뉴" : "Primary"}>
            {primary.map((item) => (
              <Link key={item.href} href={item.href} aria-current={item.match(pathname) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            <span className="hidden lg:inline dateline">{issue}</span>
            <Link href={`/${lang}/search`} aria-label={dict.nav.search} className="grid place-items-center w-9 h-9 rounded-full hover:bg-muted transition-colors">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
            </Link>
            <AuthMenu lang={lang} />
            <LanguageSwitcher lang={lang} />
            <ThemeToggle />
          </div>
        </div>

        {/* 모바일 주요 메뉴 */}
        <nav className="primary-nav md:hidden flex items-center gap-6 pb-3 -mt-1 overflow-x-auto" aria-label={ko ? "주요 메뉴" : "Primary"}>
          {primary.map((item) => (
            <Link key={item.href} href={item.href} aria-current={item.match(pathname) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {showRail && (
        <nav aria-label={ko ? "카테고리" : "Sections"} className="border-t border-border/60">
          <div className="mag-container">
            <div className="nav-index !bg-transparent !border-0">
              {siteConfig.categories.map((cat) => {
                const isActive = pathname.includes(`/category/${cat.slug}`);
                return (
                  <Link key={cat.slug} href={`/${lang}/category/${cat.slug}`} className="nav-item" aria-current={isActive ? "page" : undefined}>
                    <span className="ko">{cat.label[lang]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
