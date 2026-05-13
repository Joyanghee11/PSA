"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PublicQuestion {
  id: string;
  q: string;
  choices: string[];
}

interface ExamPayload {
  questions: PublicQuestion[];
  total: number;
  attempts: number;
  previousScore: number;
  passed: boolean;
}

interface GradeResult {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  attempts: number;
  perQuestion: { id: string; correct: boolean; correctIndex: number }[];
}

interface Props {
  examPassed: boolean;
  previousScore: number;
  attempts: number;
  learner: { nameKo: string; instructorNo: string };
}

const PASS_PERCENT = 90;

export function ExamClient({
  examPassed,
  previousScore,
  attempts,
  learner,
}: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "taking" | "result">("intro");
  const [exam, setExam] = useState<ExamPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const beginExam = useCallback(async () => {
    setError("");
    setSubmitting(true);
    try {
      // If a previous PASS exists and the user clicks "시작", clear it first
      if (examPassed) {
        await fetch("/api/safety/exam/reset", { method: "POST" });
      }
      const res = await fetch("/api/safety/exam");
      if (!res.ok) {
        setError("시험을 불러오지 못했습니다. 다시 시도해 주세요.");
        return;
      }
      const data = (await res.json()) as ExamPayload;
      setExam(data);
      setAnswers({});
      setPhase("taking");
      window.scrollTo({ top: 0 });
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [examPassed]);

  const submit = useCallback(async () => {
    if (!exam) return;
    const unanswered = exam.questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      setError(`${unanswered.length}개 문항이 응답되지 않았습니다.`);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/safety/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([id, ci]) => ({
            id,
            choiceIndex: ci,
          })),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(`채점 중 오류 (${data.error ?? res.status})`);
        return;
      }
      const data = (await res.json()) as GradeResult;
      setResult(data);
      setPhase("result");
      window.scrollTo({ top: 0 });
      router.refresh();
    } catch {
      setError("네트워크 오류로 제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [exam, answers, router]);

  // ---- Phase: result ----
  if (phase === "result" && result && exam) {
    return (
      <ResultScreen
        result={result}
        questions={exam.questions}
        answers={answers}
        onRetake={beginExam}
        loading={submitting}
      />
    );
  }

  // ---- Phase: taking ----
  if (phase === "taking" && exam) {
    return (
      <TakingScreen
        exam={exam}
        answers={answers}
        setAnswer={(id, ci) =>
          setAnswers((prev) => ({ ...prev, [id]: ci }))
        }
        onSubmit={submit}
        submitting={submitting}
        error={error}
      />
    );
  }

  // ---- Phase: intro ----
  return (
    <IntroScreen
      previousScore={previousScore}
      attempts={attempts}
      examPassed={examPassed}
      learner={learner}
      onBegin={beginExam}
      submitting={submitting}
      error={error}
    />
  );
}

// ----------------------------------------------------------------------------
// Intro
// ----------------------------------------------------------------------------
function IntroScreen({
  previousScore,
  attempts,
  examPassed,
  learner,
  onBegin,
  submitting,
  error,
}: {
  previousScore: number;
  attempts: number;
  examPassed: boolean;
  learner: { nameKo: string; instructorNo: string };
  onBegin: () => void;
  submitting: boolean;
  error: string;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.22em] text-accent">
        Final Examination
      </p>
      <h1 className="font-[family-name:var(--font-serif-kr)] text-2xl sm:text-3xl lg:text-4xl text-headline mt-3 leading-tight">
        수중레저 안전교육
        <br />
        최종 평가
      </h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        {learner.nameKo} (#{learner.instructorNo}) 님의 본 과정 학습이 완료되었습니다.
        이수증 발급을 위해 25문항의 객관식 평가를 응시해 주세요.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-card p-6 space-y-3 text-sm">
        <Row label="문항 수" value="25문항 (객관식 4지선다)" />
        <Row
          label="합격 기준"
          value={`100점 만점 중 ${PASS_PERCENT}점 이상 (23문항 이상 정답)`}
        />
        <Row label="시간 제한" value="제한 없음" />
        <Row
          label="재시험"
          value="불합격 시 재응시 가능 (응시 횟수 무제한)"
        />
        {attempts > 0 && (
          <Row
            label="이전 응시 결과"
            value={`${attempts}회 응시 — 최근 점수 ${previousScore}점${
              examPassed ? " · 합격" : " · 불합격"
            }`}
          />
        )}
      </div>

      {examPassed && (
        <div className="mt-6 rounded-lg border-2 border-accent bg-accent/5 p-5 text-sm">
          <p className="font-medium text-accent">✓ 이미 합격하셨습니다.</p>
          <p className="mt-2 text-foreground/85">
            지금 바로 이수증을 발급받거나, 원하시면 다시 응시할 수 있습니다.
            재응시 시작하면 이전 합격 상태는 초기화되며 새 점수로 갱신됩니다.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/safety/certificate"
              className="px-5 py-2.5 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
            >
              🎓 이수증 발급
            </Link>
            <button
              onClick={onBegin}
              disabled={submitting}
              className="px-5 py-2.5 rounded-md border border-border text-sm hover:bg-muted disabled:opacity-50"
            >
              다시 응시
            </button>
          </div>
        </div>
      )}

      {!examPassed && (
        <div className="mt-8">
          <button
            onClick={onBegin}
            disabled={submitting}
            className="w-full px-6 py-4 rounded-md bg-accent text-accent-foreground text-base font-medium hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "준비 중..." : "시험 시작하기"}
          </button>
          {error && (
            <p
              role="alert"
              className="mt-3 text-sm text-[color:var(--accent-warm)] text-center"
            >
              {error}
            </p>
          )}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        ※ 시험 응시 중 페이지를 새로고침하면 응답이 초기화됩니다. 가급적 한
        번에 끝까지 응시해 주세요.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="text-muted-foreground w-24 shrink-0 text-xs">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Taking
// ----------------------------------------------------------------------------
function TakingScreen({
  exam,
  answers,
  setAnswer,
  onSubmit,
  submitting,
  error,
}: {
  exam: ExamPayload;
  answers: Record<string, number>;
  setAnswer: (id: string, ci: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string;
}) {
  const answeredCount = Object.keys(answers).length;
  const total = exam.questions.length;
  const pct = Math.round((answeredCount / total) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-baseline justify-between text-[13px] sm:text-sm gap-3">
          <span className="font-medium text-headline truncate">
            최종 평가 — 25문항
          </span>
          <span className="text-muted-foreground tabular-nums shrink-0">
            {answeredCount}/{total} ({pct}%)
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ol className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        {exam.questions.map((q, i) => (
          <li
            key={q.id}
            className="rounded-lg border border-border bg-card p-4 sm:p-5"
          >
            <div className="flex items-baseline gap-2 sm:gap-3 mb-3">
              <span className="font-[family-name:var(--font-serif)] text-accent text-base sm:text-lg shrink-0 w-7 sm:w-8 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="text-[14px] sm:text-[15px] leading-relaxed text-foreground"
                style={{ wordBreak: "keep-all" }}
              >
                {q.q}
              </p>
            </div>
            <ul className="ml-9 sm:ml-11 space-y-1.5">
              {q.choices.map((c, ci) => {
                const checked = answers[q.id] === ci;
                return (
                  <li key={ci}>
                    <label
                      className={`flex items-baseline gap-2.5 sm:gap-3 px-3 py-2.5 sm:py-2 rounded-md cursor-pointer transition ${
                        checked
                          ? "bg-accent/10 ring-1 ring-accent/40"
                          : "hover:bg-muted active:bg-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={ci}
                        checked={checked}
                        onChange={() => setAnswer(q.id, ci)}
                        className="accent-[color:var(--accent)] mt-0.5 w-4 h-4"
                      />
                      <span
                        className="text-[13.5px] sm:text-[14px] leading-relaxed text-foreground/90"
                        style={{ wordBreak: "keep-all" }}
                      >
                        {String.fromCharCode(0x2460 + ci)} {c}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-6 sm:mt-8 sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 bg-background/95 backdrop-blur border-t border-border">
        {error && (
          <p
            role="alert"
            className="mb-3 text-[13px] sm:text-sm text-[color:var(--accent-warm)] text-center"
          >
            {error}
          </p>
        )}
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-md bg-accent text-accent-foreground text-[15px] sm:text-base font-medium hover:opacity-90 disabled:opacity-50"
        >
          {submitting
            ? "채점 중..."
            : `제출하기  (${answeredCount}/${total})`}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Result
// ----------------------------------------------------------------------------
function ResultScreen({
  result,
  questions,
  answers,
  onRetake,
  loading,
}: {
  result: GradeResult;
  questions: PublicQuestion[];
  answers: Record<string, number>;
  onRetake: () => void;
  loading: boolean;
}) {
  const passed = result.passed;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div
        className={`rounded-2xl p-6 sm:p-8 text-center ${
          passed
            ? "bg-accent/5 border-2 border-accent"
            : "bg-[color:var(--accent-warm)]/5 border-2 border-[color:var(--accent-warm)]"
        }`}
      >
        <p
          className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] font-medium"
          style={{ color: passed ? "var(--accent)" : "var(--accent-warm)" }}
        >
          {passed ? "PASS · 합격" : "FAIL · 불합격"}
        </p>
        <p className="mt-3 text-[56px] sm:text-[80px] leading-none font-[family-name:var(--font-serif)] text-headline tabular-nums">
          {result.percent}
          <span className="text-2xl sm:text-3xl text-muted-foreground">/100</span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {result.correct} / {result.total} 정답 · {result.attempts}회차 응시
        </p>
        <p className="mt-6 text-foreground/85 text-[15px] leading-relaxed">
          {passed
            ? `합격 기준 ${PASS_PERCENT}점을 충족했습니다. 이수증을 발급받으실 수 있습니다.`
            : `합격 기준은 ${PASS_PERCENT}점입니다. 오답을 검토하시고 재응시해 주세요.`}
        </p>
        <div className="mt-7 flex gap-3 justify-center flex-wrap">
          {passed ? (
            <Link
              href="/safety/certificate"
              className="px-6 py-3 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
            >
              🎓 이수증 발급
            </Link>
          ) : (
            <button
              onClick={onRetake}
              disabled={loading}
              className="px-6 py-3 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "준비 중..." : "재시험 응시"}
            </button>
          )}
          <Link
            href="/safety/course"
            className="px-6 py-3 rounded-md border border-border text-sm hover:bg-muted"
          >
            학습 다시 보기
          </Link>
        </div>
      </div>

      {!passed && (
        <details className="mt-10">
          <summary className="cursor-pointer text-sm font-medium text-headline mb-4">
            오답 검토 ({result.perQuestion.filter((p) => !p.correct).length}문항)
          </summary>
          <ol className="mt-4 space-y-4">
            {questions.map((q, i) => {
              const grade = result.perQuestion.find((p) => p.id === q.id);
              if (!grade || grade.correct) return null;
              const yourChoice = answers[q.id];
              return (
                <li
                  key={q.id}
                  className="rounded-md border border-[color:var(--accent-warm)]/30 bg-[color:var(--accent-warm)]/5 p-4"
                >
                  <p className="text-sm font-medium text-headline">
                    문항 {i + 1}. {q.q}
                  </p>
                  <ul className="mt-2 ml-4 space-y-1 text-[13px]">
                    {q.choices.map((c, ci) => {
                      const isCorrect = ci === grade.correctIndex;
                      const isYours = ci === yourChoice;
                      return (
                        <li
                          key={ci}
                          className={`${
                            isCorrect
                              ? "text-accent font-medium"
                              : isYours
                              ? "text-[color:var(--accent-warm)] line-through"
                              : "text-muted-foreground"
                          }`}
                        >
                          {String.fromCharCode(0x2460 + ci)} {c}{" "}
                          {isCorrect && "  ← 정답"}
                          {isYours && !isCorrect && "  ← 나의 답"}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </details>
      )}
    </div>
  );
}
