"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Fuse from "fuse.js";
import type { Article, Lang } from "@/lib/types";
import { ArticleCard } from "@/components/article/ArticleCard";
import { getDictionary } from "@/config/i18n";

export default function SearchPage() {
  const params = useParams();
  const lang = (params.lang as Lang) || "ko";
  const dict = getDictionary(lang);

  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(articles, {
      keys: [
        `${lang}.title`,
        `${lang}.summary`,
        "tags",
      ],
      threshold: 0.4,
    });
  }, [articles, lang]);

  const results = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{dict.nav.search}</h1>
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.search.placeholder}
          className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          autoFocus
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading...</p>
      ) : query.trim() ? (
        results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article) => (
              <ArticleCard key={article.slug} article={article} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            {dict.search.noResults}
          </p>
        )
      ) : null}
    </div>
  );
}
