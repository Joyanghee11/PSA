"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
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
    primaryAction = initialSession.examPassed ? (
      <Link
        href="/safety/certificate"
        className="px-5 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
      >
        🎓 이수증 발급
      </Link>
    ) : (
      <Link
        href="/safety/exam"
        className="px-5 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
      >
        📝 최종 시험 응시
      </Link>
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
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-3 min-w-0">
              <span className="text-xs uppercase tracking-[0.18em] text-accent font-semibold shrink-0">
                {initialSession.nameKo}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                #{initialSession.instructorNo}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                · {current.chapterNumber} {current.chapterTitle}
              </span>
            </div>
            <div className="flex items-baseline gap-4 shrink-0">
              {savingMessage && (
                <span className="text-xs text-accent hidden sm:inline">
                  {savingMessage}
                </span>
              )}
              <span className="text-xs text-muted-foreground tabular-nums">
                필수 {completedRequired}/{REQUIRED_CHAPTERS.length} ·{" "}
                슬라이드 {currentIndex + 1}/{totalSlides}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                로그아웃
              </button>
            </div>
          </div>
          <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Slide canvas */}
      <div className="flex-1 overflow-auto px-4 sm:px-8 py-8 flex items-start justify-center">
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
      <div className="border-t border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex <= 0}
            className="px-5 py-2 rounded-md border border-border text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            ←/→ 키 또는 Space로 슬라이드를 넘길 수 있습니다
          </p>
          {primaryAction}
        </div>
      </div>
    </div>
  );
}
