"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article, Category } from "@/lib/types";
import { siteConfig } from "@/config/site";

interface ArticleFormProps {
  initial?: Article;
  mode: "create" | "edit";
}

export function ArticleForm({ initial, mode }: ArticleFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState<Category>(
    initial?.category || "competition"
  );
  const [status, setStatus] = useState(initial?.status || "draft");
  const [tags, setTags] = useState(initial?.tags.join(", ") || "");
  const [sourceUrls, setSourceUrls] = useState(
    initial?.sourceUrls.join("\n") || ""
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [imageAlt, setImageAlt] = useState(initial?.imageAlt || "");
  const [uploading, setUploading] = useState(false);

  // Korean
  const [koTitle, setKoTitle] = useState(initial?.ko.title || "");
  const [koSummary, setKoSummary] = useState(initial?.ko.summary || "");
  const [koBody, setKoBody] = useState(initial?.ko.body || "");
  const [koMeta, setKoMeta] = useState(initial?.ko.metaDescription || "");

  // English
  const [enTitle, setEnTitle] = useState(initial?.en.title || "");
  const [enSummary, setEnSummary] = useState(initial?.en.summary || "");
  const [enBody, setEnBody] = useState(initial?.en.body || "");
  const [enMeta, setEnMeta] = useState(initial?.en.metaDescription || "");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else {
        const data = await res.json();
        setError(data.error || "이미지 업로드에 실패했습니다.");
      }
    } catch {
      setError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      category,
      status,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sourceUrls: sourceUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
      imageUrl: imageUrl || undefined,
      imageAlt: imageAlt || undefined,
      ko: { title: koTitle, summary: koSummary, body: koBody, metaDescription: koMeta },
      en: { title: enTitle, summary: enSummary, body: enBody, metaDescription: enMeta },
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/articles"
          : `/api/admin/articles/${initial!.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "저장에 실패했습니다.");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Meta */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            {siteConfig.categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label.ko} / {cat.label.en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">상태</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="draft">초안 (Draft)</option>
            <option value="published">공개 (Published)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            태그 (쉼표 구분)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            placeholder="freediving, record, AIDA"
          />
        </div>
      </section>

      {/* Image */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold border-b border-border pb-2">
          이미지
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                이미지 업로드
              </label>
              <label
                className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-muted/50 transition-colors ${
                  uploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-muted-foreground">
                  {uploading ? "업로드 중..." : "클릭하여 이미지 선택 (최대 5MB)"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                또는 이미지 URL 직접 입력
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                이미지 설명 (선택)
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="이미지 alt 텍스트"
              />
            </div>
          </div>
          <div>
            {imageUrl ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">미리보기</p>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src={imageUrl}
                    alt={imageAlt || "Preview"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setImageUrl(""); setImageAlt(""); }}
                  className="text-xs text-red-500 hover:underline"
                >
                  이미지 제거
                </button>
              </div>
            ) : (
              <div className="aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <p className="text-sm text-muted-foreground">이미지 미리보기</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Korean Content */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold border-b border-border pb-2">
          한국어 콘텐츠
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            type="text"
            value={koTitle}
            onChange={(e) => setKoTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            placeholder="한국어 기사 제목"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            요약 (160자 이내)
          </label>
          <input
            type="text"
            value={koSummary}
            onChange={(e) => setKoSummary(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            placeholder="기사 요약"
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            본문 (HTML 지원)
          </label>
          <textarea
            value={koBody}
            onChange={(e) => setKoBody(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground min-h-[250px] font-mono text-sm"
            placeholder="<p>기사 본문을 입력하세요...</p>"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            SEO 설명 (155자 이내)
          </label>
          <input
            type="text"
            value={koMeta}
            onChange={(e) => setKoMeta(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            placeholder="검색엔진용 설명"
            maxLength={160}
          />
        </div>
      </section>

      {/* English Content */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold border-b border-border pb-2">
          English Content
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={enTitle}
            onChange={(e) => setEnTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            placeholder="English article title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Summary (under 160 chars)
          </label>
          <input
            type="text"
            value={enSummary}
            onChange={(e) => setEnSummary(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            placeholder="Article summary"
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Body (HTML supported)
          </label>
          <textarea
            value={enBody}
            onChange={(e) => setEnBody(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground min-h-[250px] font-mono text-sm"
            placeholder="<p>Write your article body here...</p>"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Meta Description (under 155 chars)
          </label>
          <input
            type="text"
            value={enMeta}
            onChange={(e) => setEnMeta(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            placeholder="SEO description"
            maxLength={160}
          />
        </div>
      </section>

      {/* Source URLs */}
      <section>
        <label className="block text-sm font-medium mb-1">
          출처 URL (한 줄에 하나씩, 선택)
        </label>
        <textarea
          value={sourceUrls}
          onChange={(e) => setSourceUrls(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground min-h-[80px] font-mono text-sm"
          placeholder={"https://source1.com/article\nhttps://source2.com/article"}
        />
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving
            ? "저장 중..."
            : mode === "create"
            ? "기사 작성"
            : "기사 수정"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-2.5 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
