"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdBanner, AdPosition } from "@/lib/ads";

const POSITIONS: { value: AdPosition; label: string }[] = [
  { value: "header-top", label: "① 헤더 상단 (728x90)" },
  { value: "sidebar", label: "② 사이드바 (300x250)" },
  { value: "between-articles", label: "③ 기사 목록 사이 (반응형)" },
  { value: "article-top", label: "④ 기사 본문 위 (728x90)" },
  { value: "article-bottom", label: "⑤ 기사 본문 아래 (728x90)" },
  { value: "footer-above", label: "⑥ 푸터 위 (반응형)" },
  { value: "sticky-left", label: "⑦ 좌측 세로 배너 (160x600)" },
  { value: "sticky-right", label: "⑧ 우측 세로 배너 (160x600)" },
];

function EmptyForm(): Omit<AdBanner, "id" | "createdAt"> {
  return {
    position: "header-top",
    imageUrl: "",
    linkUrl: "",
    altText: "",
    active: true,
    order: 0,
    startDate: "",
    endDate: "",
  };
}

export default function AdminAdsPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EmptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    const res = await fetch("/api/admin/ads");
    if (res.status === 401) { router.push("/admin/login"); return; }
    setBanners(await res.json());
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const body = editingId
      ? { ...form, id: editingId, _action: "update" }
      : form;

    const res = await fetch("/api/admin/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditingId(null);
    setForm(EmptyForm());
    setSaving(false);

    // 저장 후 2초 대기하여 Blob 캐시 갱신 후 다시 로드
    setTimeout(() => fetchBanners(), 2000);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 배너를 삭제하시겠습니까?")) return;
    // 즉시 로컬 상태 업데이트
    setBanners((prev) => prev.filter((b) => b.id !== id));
    await fetch("/api/admin/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "delete", id }),
    });
  }

  async function handleToggle(banner: AdBanner) {
    // 즉시 로컬 상태 업데이트
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, active: !b.active } : b))
    );
    await fetch("/api/admin/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "update", id: banner.id, active: !banner.active }),
    });
    fetchBanners();
  }

  function startEdit(b: AdBanner) {
    setForm({
      position: b.position,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl,
      altText: b.altText,
      active: b.active,
      order: b.order,
      startDate: b.startDate || "",
      endDate: b.endDate || "",
    });
    setEditingId(b.id);
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setForm((f) => ({ ...f, imageUrl: data.url }));
    }
    setUploading(false);
    e.target.value = "";
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
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-accent">PSA Admin</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">광고 배너 관리</span>
          </div>
          <button
            onClick={() => { setForm(EmptyForm()); setEditingId(null); setShowForm(true); }}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90"
          >
            + 배너 추가
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "배너 수정" : "새 배너 추가"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">위치</label>
                <select
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value as AdPosition }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">순서</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">배너 이미지</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    placeholder="이미지 URL 또는 업로드"
                  />
                  <label className={`px-4 py-2 border border-border rounded-lg text-sm cursor-pointer hover:bg-muted ${uploading ? "opacity-50" : ""}`}>
                    {uploading ? "업로드 중..." : "파일 선택"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Preview" className="mt-2 max-h-[100px] border border-border" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">클릭 링크 URL</label>
                <input
                  type="url"
                  value={form.linkUrl}
                  onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">설명 (alt)</label>
                <input
                  type="text"
                  value={form.altText}
                  onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="배너 설명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">게재 시작일 (선택)</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">게재 종료일 (선택)</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                disabled={saving || !form.imageUrl}
                className="px-5 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "저장 중..." : editingId ? "수정" : "추가"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="px-5 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Banner list */}
        <div className="space-y-3">
          {banners.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">등록된 배너가 없습니다.</p>
          ) : (
            banners.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${b.active ? "bg-green-500" : "bg-gray-400"}`} />
                <img src={b.imageUrl} alt={b.altText} className="h-12 w-auto max-w-[120px] object-contain border border-border flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium">
                      {POSITIONS.find((p) => p.value === b.position)?.label || b.position}
                    </span>
                    <span className="text-muted-foreground">순서: {b.order}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{b.linkUrl}</p>
                  {(b.startDate || b.endDate) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {b.startDate || "~"} ~ {b.endDate || "무기한"}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleToggle(b)} className={`px-3 py-1.5 text-xs rounded-lg border ${b.active ? "border-yellow-300 text-yellow-700" : "border-green-300 text-green-700"}`}>
                    {b.active ? "비활성" : "활성"}
                  </button>
                  <button onClick={() => startEdit(b)} className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-muted">
                    수정
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="px-3 py-1.5 text-xs rounded-lg border border-red-300 text-red-600 hover:bg-red-50">
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
