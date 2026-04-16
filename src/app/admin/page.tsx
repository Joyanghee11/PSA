"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { getCategoryLabel, getCategoryColor } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function handleDelete(slug: string) {
    if (!confirm("정말 이 기사를 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/admin/articles/${slug}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.slug !== slug));
    }
  }

  async function handleToggleStatus(article: Article) {
    const newStatus = article.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/admin/articles/${article.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setArticles((prev) =>
        prev.map((a) =>
          a.slug === article.slug ? { ...a, status: newStatus } : a
        )
      );
    }
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
            <Link href="/admin" className="text-xl font-bold text-accent">
              PSA Admin
            </Link>
            <Link
              href="/ko"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              사이트 보기
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/ads"
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              광고 관리
            </Link>
            <Link
              href="/admin/create"
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              + 새 기사 작성
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">기사 관리</h1>
          <p className="text-sm text-muted-foreground">
            총 {articles.length}개
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>아직 기사가 없습니다.</p>
            <Link
              href="/admin/create"
              className="inline-block mt-4 text-accent hover:underline"
            >
              첫 번째 기사 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
              >
                {/* Status dot */}
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    article.status === "published"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                  title={article.status}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {getCategoryLabel(article.category, "ko")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString("ko")}
                    </span>
                  </div>
                  <h3 className="font-medium truncate">{article.ko.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {article.en.title}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
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
