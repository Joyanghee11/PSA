"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import type { Article, Lang } from "@/lib/types";
import { VideoCard } from "./VideoCard";

export function VideoCarousel({
  articles,
  lang,
}: {
  articles: Article[];
  lang: Lang;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // 날마다 순서를 바꾼다. 렌더 중 Math.random 을 쓰면 서버와 브라우저 결과가 달라
  // 하이드레이션이 깨지므로, 날짜(KST)를 씨앗으로 한 결정적 셔플을 쓴다.
  const shuffled = useMemo(() => {
    const arr = [...articles].sort((a, b) => a.slug.localeCompare(b.slug));
    let seed = Number(new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10).replace(/-/g, ""));
    const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [articles]);

  // 5초마다 자동 스크롤
  useEffect(() => {
    if (paused || !scrollRef.current) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const cardWidth = 316; // 300px + 16px gap
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 10) {
        // 끝에 도달하면 처음으로
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paused]);

  if (shuffled.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 3000)}
    >
      {/* 좌측 화살표 */}
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: -316, behavior: "smooth" })}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
        aria-label="Previous"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {shuffled.map((v) => (
          <VideoCard key={v.slug} article={v} lang={lang} />
        ))}
      </div>

      {/* 우측 화살표 */}
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: 316, behavior: "smooth" })}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
        aria-label="Next"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
