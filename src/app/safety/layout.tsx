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
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/safety"
            className="flex items-baseline gap-3 group"
            aria-label="PSA Safety 홈으로"
          >
            <span className="font-[family-name:var(--font-serif)] text-xl tracking-tight text-headline group-hover:text-accent transition-colors">
              PSA<span className="text-accent">·</span>safety
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              수중레저 안전교육 온라인 과정
            </span>
          </Link>
          <span className="text-xs text-muted-foreground tracking-[0.18em] uppercase hidden sm:inline">
            PSAI Korea · Safety Education
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-6 text-xs text-muted-foreground flex flex-wrap gap-4 justify-between">
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
