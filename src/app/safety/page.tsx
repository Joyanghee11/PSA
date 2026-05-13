import { redirect } from "next/navigation";
import { readSafetySession } from "@/lib/safety/session";
import { SafetyLoginForm } from "./SafetyLoginForm";

export default async function SafetyEntryPage() {
  const session = await readSafetySession();
  if (session) {
    redirect("/safety/course");
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-10 grid lg:grid-cols-[1fr_420px] gap-6 sm:gap-10">
      {/* Hero / programme info */}
      <section className="space-y-5 sm:space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-accent">
            PSAI KOREA · 회원 전용 안전교육
          </p>
          <h1 className="font-[family-name:var(--font-serif-kr)] text-3xl sm:text-4xl lg:text-5xl leading-tight text-headline">
            수중레저
            <br />
            <em className="not-italic text-accent">안전교육</em>{" "}
            온라인 과정
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            「수중레저활동의 안전 및 활성화 등에 관한 법률」 제20조 및 시행규칙
            제13조에 따른 안전교육을 PSA 회원이 온라인으로 학습하고 이수증을
            발급받을 수 있는 과정입니다.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { k: "교재 출처", v: "2019 연안체험활동 안전교육 (해양경찰청)" },
            { k: "구성", v: "본문 슬라이드 + 6회 지식복습 퀴즈 + 25문항 최종 평가" },
            { k: "학습 시간", v: "약 60–90분" },
            { k: "이수 요건", v: "전 단원 학습 + 최종 평가 90점 이상" },
          ].map((it) => (
            <li
              key={it.k}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="text-xs text-muted-foreground">{it.k}</div>
              <div className="mt-1 text-foreground">{it.v}</div>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-border bg-card p-5 text-sm leading-relaxed">
          <h2 className="font-medium text-headline mb-2">학습 흐름</h2>
          <ol className="space-y-1.5 text-foreground/90 list-decimal pl-5">
            <li>
              <span className="text-muted-foreground">[안내]</span> 목차 — 과정
              개요
            </li>
            <li>
              <strong className="text-foreground">Ⅰ. 연안사고 예방법</strong> —
              본문 슬라이드 + 지식복습 퀴즈 3회
            </li>
            <li>
              <strong className="text-foreground">Ⅳ. 수중형</strong> — 본문
              슬라이드 + 지식복습 퀴즈 3회
            </li>
            <li>📌 2026 최신 법령 업데이트 부록</li>
            <li>
              <strong className="text-[color:var(--accent-warm)]">
                최종 평가 (25문항)
              </strong>{" "}
              — 90점 이상 합격 · 불합격 시 재응시 가능
            </li>
            <li>이수증 PDF 발급 (도장·일련번호 자동 부여)</li>
          </ol>
        </div>

        <p className="text-xs text-muted-foreground">
          본 과정은 PSA 등록 강사 및 안전요원 자격자에 한해 수강할 수 있으며,
          입력한 정보가 PSA 회원명부와 일치할 때 학습이 시작됩니다.
        </p>
      </section>

      {/* Login form */}
      <section className="lg:sticky lg:top-10 self-start">
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <h2 className="text-lg font-medium text-headline">회원 정보 입력</h2>
            <p className="text-xs text-muted-foreground mt-1">
              5개 항목 모두 PSA 등록 정보와 일치해야 합니다.
            </p>
          </div>
          <div className="p-6">
            <SafetyLoginForm />
          </div>
          <div className="bg-muted/50 px-6 py-3 text-xs text-muted-foreground border-t border-border">
            정보가 일치하지 않거나 강사 번호가 누락된 경우 PSA 본부로 문의해
            주세요.
          </div>
        </div>
      </section>
    </div>
  );
}
