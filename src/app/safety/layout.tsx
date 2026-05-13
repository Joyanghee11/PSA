import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PSA Safety — 수중레저 안전교육",
  description:
    "PSA 회원 전용 「수중레저활동 안전교육」 온라인 학습 — 등록·수강·이수증 발급",
};

export default function SafetyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link
            href="/safety"
            className="flex items-baseline gap-2 sm:gap-3 group min-w-0"
            aria-label="PSA Safety 홈으로"
          >
            <span className="font-[family-name:var(--font-serif)] text-lg sm:text-xl tracking-tight text-headline group-hover:text-accent transition-colors shrink-0">
              PSA<span className="text-accent">·</span>safety
            </span>
            <span className="text-[11px] sm:text-xs text-muted-foreground hidden sm:inline truncate">
              수중레저 안전교육 온라인 과정
            </span>
          </Link>
          <span className="text-[10px] sm:text-xs text-muted-foreground tracking-[0.14em] sm:tracking-[0.18em] uppercase shrink-0">
            <span className="hidden sm:inline">PSAI Korea · Safety Education</span>
            <span className="sm:hidden">PSAI KOREA</span>
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6 text-[11px] sm:text-xs text-muted-foreground flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-4 sm:justify-between leading-relaxed">
          <span>© 2026 PSAI KOREA. 본 이수증은 PSAI KOREA가 발행합니다.</span>
          <span>
            법령 적용 시{" "}
            <a
              href="https://www.law.go.kr/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              국가법령정보센터
            </a>{" "}
            현행 조문을 확인하세요.
          </span>
        </div>
      </footer>
    </div>
  );
}
