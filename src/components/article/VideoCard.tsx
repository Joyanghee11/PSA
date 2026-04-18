"use client";

import { useState } from "react";
import type { Article, Lang } from "@/lib/types";

export function VideoCard({ article, lang }: { article: Article; lang: Lang }) {
  const [playing, setPlaying] = useState(false);
  const videoId = article.en.body.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1];
  const content = article[lang];

  if (!videoId) return null;

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[300px]">
      <div className="relative aspect-video bg-black overflow-hidden rounded">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="w-full h-full relative group cursor-pointer"
          >
            <img
              src={article.imageUrl || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-lg">
                <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      <h3 className="text-sm font-semibold mt-2 line-clamp-2" style={{ wordBreak: "keep-all" }}>
        {content.title}
      </h3>
    </div>
  );
}
