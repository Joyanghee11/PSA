import Link from "next/link";

/** 로그인·가입·내 정보 화면의 공용 틀. 저널 지면(흰 바탕·남색 제목·금색 줄)에 맞춘다. */
export function AuthShell({
  kicker,
  title,
  lead,
  width = 480,
  children,
}: {
  kicker: string;
  title: string;
  lead?: React.ReactNode;
  width?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 bg-muted/60">
      <div className="masthead-rule" />
      <header className="mag-container flex h-[64px] items-center">
        <Link href="/ko" className="flex items-baseline gap-2.5 select-none" aria-label="다이브 저널 홈">
          <span className="wordmark text-[24px]">다이브 저널</span>
          <span className="wordmark-en text-[14px]">Dive Journal</span>
        </Link>
      </header>
      <main className="px-4 pt-4 pb-20 sm:pt-10">
        <div className="mx-auto" style={{ maxWidth: width }}>
          <div className="bg-card border border-border rounded-[18px] shadow-[var(--shadow-2)] px-5 py-8 sm:px-10 sm:py-10">
            <span className="kicker">{kicker}</span>
            <h1 className="font-headline text-[28px] sm:text-[34px] mt-3">{title}</h1>
            {lead && <div className="text-[15px] leading-relaxed text-muted-foreground mt-3">{lead}</div>}
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** PSA 회원 안내 상자 */
export function PsaMemberNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] px-4 py-3.5 text-[14px] leading-relaxed text-foreground">
      {children}
    </div>
  );
}

export function FormAlert({ tone = "error", children }: { tone?: "error" | "info"; children: React.ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "rounded-lg border border-[color-mix(in_srgb,var(--danger)_35%,transparent)] bg-[color-mix(in_srgb,var(--danger)_7%,transparent)] px-3.5 py-2.5 text-[14px] text-danger"
          : "rounded-lg border border-border bg-muted px-3.5 py-2.5 text-[14px] text-foreground"
      }
    >
      {children}
    </div>
  );
}
