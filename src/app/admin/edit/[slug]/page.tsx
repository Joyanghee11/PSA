"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { Article } from "@/lib/types";

export default function AdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/articles/${slug}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (res.status === 404) {
          router.push("/admin");
          return;
        }
        const data = await res.json();
        setArticle(data);
      } catch {
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/admin" className="text-xl font-bold text-accent">
            PSA Admin
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">기사 편집</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">기사 편집</h1>
        <ArticleForm mode="edit" initial={article} />
      </main>
    </div>
  );
}
