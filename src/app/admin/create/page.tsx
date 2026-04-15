"use client";

import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default function AdminCreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/admin" className="text-xl font-bold text-accent">
            PSA Admin
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">새 기사 작성</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">새 기사 작성</h1>
        <ArticleForm mode="create" />
      </main>
    </div>
  );
}
