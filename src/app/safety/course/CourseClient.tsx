"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { SlideRenderer } from "@/components/safety/SlideRenderer";
import type { SafetyChapter } from "@/lib/safety/slideTypes";

interface SessionInfo {
  nameKo: string;
  instructorNo: string;
  completedChapters: string[];
  lastPage: number;
  examPassed: boolean;
}

interface FlatSlide {
  globalIndex: number;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: string;
  indexInChapter: number;
  totalInChapter: number;
  slide: SafetyChapter["slides"][number];
}

interface Props {
  chapters: SafetyChapter[];
  session: SessionInfo;
}

const REQUIRED_CHAPTERS = ["ch1", "ch4", "addendum"];

export function CourseClient({ chapters, session: initialSession }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const flatSlides = useMemo<FlatSlide[]>(() => {
    const out: FlatSlide[] = [];
    let g = 0;
    for (const ch of chapters) {
      for (let i = 0; i < ch.slides.length; i++) {
        out.push({
          globalIndex: g++,
          chapterId: ch.id,
          chapterTitle: ch.titleKr,
          chapterNumber: ch.number,
          indexInChapter: i,
          totalInChapter: ch.slides.length,
          slide: ch.slides[i],
        });
      }
    }
    return out;
  }, [chapters]);

  const totalSlides = flatSlides.length;
  const initialIndex = Math.min(
    Math.max((initialSession.lastPage ?? 1) - 1, 0),
    totalSlides - 1
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [completed, setCompleted] = useState<string[]>(
    initialSession.completedChapters ?? []
  );
  const [passedQuizzes, setPassedQuizzes] = useState<Set<string>>(new Set());
  const [savingMessage, setSavingMessage] = useState("");
  const [handoffPending, setHandoffPending] = useState(false);
  const [handoffError, setHandoffError] = useState("");

  const current = flatSlides[currentIndex];
  const isOnQuiz = current.slide.type === "quizCheckpoint";
  const isQuizUnlocked = !isOnQuiz || passedQuizzes.has(current.slide.id);

  const allRequiredComplete = REQUIRED_CHAPTERS.every((c) =>
    completed.includes(c)
  );
  const isOnLastSlide = currentIndex === totalSlides - 1;

  const postProgress = useCallback(
    async (payload: { lastPage?: number; completedChapter?: string }) => {
      try {
        await fetch("/api/safety/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // best-effort
      }
    },
    []
  );

  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goTo = useCallback(
    (idx: number) => {
      // Forward navigation is gated on quiz unlock
      const movingForward = idx > currentIndex;
      if (movingForward && isOnQuiz && !isQuizUnlocked) return;

      const clamped = Math.min(Math.max(idx, 0), totalSlides - 1);
      setCurrentIndex(clamped);
      const target = flatSlides[clamped];
      if (!target) return;

      if (target.indexInChapter === target.totalInChapter - 1) {
        setCompleted((prev) => {
          if (prev.includes(target.chapterId)) return prev;
          if (REQUIRED_CHAPTERS.includes(target.chapterId)) {
            void postProgress({ completedChapter: target.chapterId });
            setSavingMessage(`✓ "${target.chapterTitle}" 단원 이수 완료`);
            if (completionTimerRef.current)
              clearTimeout(completionTimerRef.current);
            completionTimerRef.current = setTimeout(
              () => setSavingMessage(""),
              2400
            );
          }
          return [...prev, target.chapterId];
        });
      }
    },
    [
      currentIndex,
      isOnQuiz,
      isQuizUnlocked,
      totalSlides,
      flatSlides,
      postProgress,
    ]
  );

  const handleQuizPassed = useCallback((slideId: string) => {
    setPassedQuizzes((prev) => {
      if (prev.has(slideId)) return prev;
      const next = new Set(prev);
      next.add(slideId);
      return next;
    });
  }, []);

  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      void postProgress({ lastPage: currentIndex + 1 });
    }, 600);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [currentIndex, postProgress]);

  useEffect(() => {
    return () => {
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    };
  }, []);

  // Keyboard navigation — backward always; forward respects quiz lock via goTo()
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement) {
        const t = e.target.tagName.toLowerCase();
        if (t === "input" || t === "textarea" || t === "select") return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goTo(currentIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goTo(currentIndex - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, goTo]);

  async function handleLogout() {
    await fetch("/api/safety/logout", { method: "POST" });
    startTransition(() => {
      router.push("/safety");
      router.refresh();
    });
  }

  /**
   * Race-safe handoff to /safety/exam (or /safety/certificate). The client
   * may "know" the course is complete before the server-side JWT cookie has
   * been updated by the latest postProgress fetch. Without this guard, the
   * navigation can land on /safety/exam SSR while the cookie still says
   * isCourseComplete=false, triggering a redirect back to /safety/course.
   *
   * We explicitly POST every required chapter (and the current lastPage),
   * AWAITING each response so the Set-Cookie has been applied before the
   * navigation triggers a fresh SSR.
   */
  async function handleHandoff(destination: string) {
    if (handoffPending) return;
    setHandoffPending(true);
    setHandoffError("");
    try {
      // Mark every required chapter so the server is unambiguous, even if
      // the local client state already includes them. The server's progress
      // route is idempotent for already-completed chapters.
      for (const ch of REQUIRED_CHAPTERS) {
        const res = await fetch("/api/safety/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completedChapter: ch }),
        });
        if (!res.ok) {
          throw new Error(`progress sync failed (${res.status})`);
        }
      }
      await fetch("/api/safety/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastPage: currentIndex + 1 }),
      });
      // Hard navigation here to guarantee the browser sends the updated
      // cookie that the prior POSTs set; router.push uses prefetched RSC
      // that may have been computed against the old cookie value.
      window.location.assign(destination);
    } catch (e) {
      setHandoffError(
        (e as Error).message ||
          "진행 정보 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
      setHandoffPending(false);
    }
  }

  const overallPct = Math.round(((currentIndex + 1) / totalSlides) * 100);
  const completedRequired = REQUIRED_CHAPTERS.filter((c) =>
    completed.includes(c)
  ).length;

  // Right-side action: depends on completion + position
  let primaryAction: React.ReactNode;
  if (isOnQuiz && !isQuizUnlocked) {
    primaryAction = (
      <button
        disabled
        className="px-5 py-2 rounded-md bg-muted text-muted-foreground text-sm cursor-not-allowed"
        title="문항을 풀고 정답 확인 버튼을 눌러야 진행할 수 있습니다"
      >
        🔒 퀴즈 풀이 필요
      </button>
    );
  } else if (isOnLastSlide && allRequiredComplete) {
    const destination = initialSession.examPassed
      ? "/safety/certificate"
      : "/safety/exam";
    const label = initialSession.examPassed
      ? "🎓 이수증 발급"
      : "📝 최종 시험 응시";
    primaryAction = (
      <button
        type="button"
        onClick={() => handleHandoff(destination)}
        disabled={handoffPending}
        className="px-5 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-wait"
      >
        {handoffPending ? "이동 준비 중..." : label}
      </button>
    );
  } else {
    primaryAction = (
      <button
        onClick={() => goTo(currentIndex + 1)}
        disabled={currentIndex >= totalSlides - 1}
        className="px-5 py-2 rounded-md bg-accent text-accent-foreground text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        다음 →
      </button>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-128px)] bg-muted/30">
      {/* Top progress bar */}
      <div className="border-b border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          {/* Row 1: identity + chapter */}
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-2 sm:gap-3 min-w-0">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] text-accent font-semibold shrink-0">
                {initialSession.nameKo}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 hidden xs:inline">
                #{initialSession.instructorNo}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground truncate">
                · {current.chapterNumber} {current.chapterTitle}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              로그아웃
            </button>
          </div>
          {/* Row 2: progress strip + counters */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground tabular-nums shrink-0">
              필수 {completedRequired}/{REQUIRED_CHAPTERS.length}  ·{" "}
              {currentIndex + 1}/{totalSlides}
            </span>
          </div>
          {savingMessage && (
            <p className="mt-1.5 text-[11px] text-accent">{savingMessage}</p>
          )}
          {handoffError && (
            <p className="mt-1.5 text-[11px] text-[color:var(--accent-warm)]">
              {handoffError}
            </p>
          )}
        </div>
      </div>

      {/* Slide canvas — page-level scroll on mobile, contained scroll on sm+ */}
      <div className="flex-1 sm:overflow-auto px-3 sm:px-8 py-4 sm:py-8 flex items-start justify-center">
        <SlideRenderer
          slide={current.slide}
          chapterTitle={`${current.chapterNumber} · ${current.chapterTitle}`}
          slideIndex={current.indexInChapter}
          totalInChapter={current.totalInChapter}
          onCheckpointPassed={handleQuizPassed}
          alreadyPassed={
            current.slide.type === "quizCheckpoint" &&
            passedQuizzes.has(current.slide.id)
          }
        />
      </div>

      {/* Bottom nav */}
      <div className="border-t border-border bg-background sticky bottom-0">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex <= 0}
            className="px-3 sm:px-5 py-2.5 sm:py-2 rounded-md border border-border text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="이전 슬라이드"
          >
            ← 이전
          </button>
          <p className="text-[11px] text-muted-foreground hidden lg:block">
            ←/→ 키 또는 Space로 슬라이드를 넘길 수 있습니다
          </p>
          <div className="shrink-0">{primaryAction}</div>
        </div>
      </div>
    </div>
  );
}
