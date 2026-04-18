"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { getCategoryLabel, getCategoryColor } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const res = await fetch("/api/admin/articles");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setArticles(data);
    } catch {
      console.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  }

  // 카테고리 목록 (기사에서 추출)
  const categoryList = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return Array.from(cats).sort();
  }, [articles]);

  // 필터링된 기사
  const filtered = useMemo(() => {
    return articles.filter((a) => {
      // 검색
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          a.ko.title.toLowerCase().includes(q) ||
          a.en.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      // 카테고리
      if (filterCategory !== "all" && a.category !== filterCategory) return false;
      // 상태
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      return true;
    });
  }, [articles, search, filterCategory, filterStatus]);

  async function handleDelete(slug: string) {
    if (!confirm("정말 이 기사를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/articles/${slug}`, { method: "DELETE" });
    if (res.ok) setArticles((prev) => prev.filter((a) => a.slug !== slug));
  }

  async function handleToggleStatus(article: Article) {
    const newStatus = article.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/admin/articles/${article.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok)
      setArticles((prev) =>
        prev.map((a) => (a.slug === article.slug ? { ...a, status: newStatus } : a))
      );
  }

  async function handlePin(article: Article, pin: "top" | "featured" | undefined) {
    // 같은 값이면 해제
    const newPin = article.pinned === pin ? undefined : pin;
    setArticles((prev) =>
      prev.map((a) => (a.slug === article.slug ? { ...a, pinned: newPin } : a))
    );
    await fetch(`/api/admin/articles/${article.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: newPin ?? null }),
    });
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-accent">다이브저널 Admin</Link>
            <Link href="/ko" className="text-sm text-muted-foreground hover:text-foreground">사이트 보기</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/ads" className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">광고 관리</Link>
            <Link href="/admin/create" className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">+ 새 기사 작성</Link>
            <button onClick={handleLogout} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">로그아웃</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title + Count */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">기사 관리</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length === articles.length
              ? `총 ${articles.length}개`
              : `${filtered.length} / ${articles.length}개`}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* 검색 */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목, 슬러그, 태그로 검색..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          {/* 카테고리 필터 */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm min-w-[140px]"
          >
            <option value="all">모든 카테고리</option>
            {categoryList.map((cat) => (
              <option key={cat} value={cat}>
                {getCategoryLabel(cat as any, "ko")} ({articles.filter((a) => a.category === cat).length})
              </option>
            ))}
          </select>

          {/* 상태 필터 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm min-w-[120px]"
          >
            <option value="all">모든 상태</option>
            <option value="published">공개 ({articles.filter((a) => a.status === "published").length})</option>
            <option value="draft">초안 ({articles.filter((a) => a.status === "draft").length})</option>
          </select>
        </div>

        {/* 카테고리 빠른 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              filterCategory === "all"
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border text-muted-foreground hover:border-foreground"
            }`}
          >
            전체
          </button>
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? "all" : cat)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filterCategory === cat
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              {getCategoryLabel(cat as any, "ko")} ({articles.filter((a) => a.category === cat).length})
            </button>
          ))}
        </div>

        {/* Article list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {articles.length === 0 ? (
              <>
                <p>아직 기사가 없습니다.</p>
                <Link href="/admin/create" className="inline-block mt-4 text-accent hover:underline">첫 번째 기사 작성하기</Link>
              </>
            ) : (
              <p>검색 결과가 없습니다.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((article) => (
              <div key={article.slug} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    article.status === "published" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                  title={article.status}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {article.pinned === "top" && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">📌 최상단</span>
                    )}
                    {article.pinned === "featured" && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded">⭐ 상단</span>
                    )}
                    <button
                      onClick={() => setFilterCategory(article.category)}
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 ${getCategoryColor(article.category)}`}
                    >
                      {getCategoryLabel(article.category, "ko")}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString("ko")}
                    </span>
                  </div>
                  <h3 className="font-medium truncate">{article.ko.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{article.en.title}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handlePin(article, "top")}
                    className={`px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                      article.pinned === "top"
                        ? "bg-red-600 text-white border-red-600"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                    title="최상단 고정"
                  >
                    📌
                  </button>
                  <button
                    onClick={() => handlePin(article, "featured")}
                    className={`px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                      article.pinned === "featured"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                    title="상단 고정"
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => handleToggleStatus(article)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      article.status === "published"
                        ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                        : "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                    }`}
                  >
                    {article.status === "published" ? "비공개" : "공개"}
                  </button>
                  <Link
                    href={`/admin/edit/${article.slug}`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    편집
                  </Link>
                  <button
                    onClick={() => handleDelete(article.slug)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
