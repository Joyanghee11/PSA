"use client";

import { useRef, useState } from "react";
import { createDataBrowserClient } from "@/lib/supabase/data-browser";
import { requestUpload, adminRequestCoverUpload } from "@/app/actions/community";

type Item = { path: string; preview: string };

/**
 * 서버가 발급한 서명 URL 로 브라우저가 Storage 에 바로 올린다.
 * Vercel 요청 크기 한도(4.5MB) 때문에 원본 사진은 서버를 거치지 않는다.
 * 올린 경로들은 hidden input(name) 에 줄바꿈으로 담겨 폼과 함께 제출된다.
 */
export function ImageUploader({
  bucket,
  name,
  max = 8,
  lang,
  admin = false,
}: {
  bucket: "artworks" | "contest";
  name: string;
  max?: number;
  lang: "ko" | "en";
  admin?: boolean;
}) {
  const ko = lang === "ko";
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    const supabase = createDataBrowserClient();
    const room = max - items.length;
    const picked = Array.from(files).slice(0, room);
    for (const file of picked) {
      const res = admin ? await adminRequestCoverUpload(file.type) : await requestUpload(bucket, file.type, file.size);
      if (!res.ok || !res.data) {
        setError(res.ok ? (ko ? "업로드를 준비하지 못했습니다." : "Upload failed.") : res.error);
        continue;
      }
      const { error: upErr } = await supabase.storage.from(bucket).uploadToSignedUrl(res.data.path, res.data.token, file, { contentType: file.type });
      if (upErr) {
        setError(ko ? "사진을 올리지 못했습니다. 다시 시도해 주세요." : "Could not upload. Try again.");
        continue;
      }
      const preview = URL.createObjectURL(file);
      setItems((prev) => [...prev, { path: res.data!.path, preview }]);
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(i: number, d: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = i + d;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      <input type="hidden" name={name} value={items.map((i) => i.path).join("\n")} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it, i) => (
          <div key={it.path} className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-[var(--shadow-1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.preview} alt="" className="w-full h-full object-cover" />
            {i === 0 && max > 1 && (
              <span className="absolute left-2 top-2 chip !bg-black/60 !text-white">{ko ? "대표" : "Cover"}</span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between p-1.5 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex gap-1">
                {max > 1 && (
                  <>
                    <button type="button" onClick={() => move(i, -1)} className="w-7 h-7 rounded-full bg-white/85 text-black text-sm" aria-label={ko ? "앞으로" : "Move left"}>‹</button>
                    <button type="button" onClick={() => move(i, 1)} className="w-7 h-7 rounded-full bg-white/85 text-black text-sm" aria-label={ko ? "뒤로" : "Move right"}>›</button>
                  </>
                )}
              </div>
              <button type="button" onClick={() => setItems((p) => p.filter((_, k) => k !== i))} className="w-7 h-7 rounded-full bg-white/85 text-black text-sm" aria-label={ko ? "삭제" : "Remove"}>×</button>
            </div>
          </div>
        ))}
        {items.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="aspect-square rounded-xl border-2 border-dashed border-border-strong grid place-items-center text-muted-foreground hover:border-accent-teal hover:text-accent-teal transition-colors"
          >
            <span className="text-center text-sm leading-relaxed px-2">
              {busy ? (ko ? "올리는 중…" : "Uploading…") : (
                <>
                  <span className="block text-3xl leading-none mb-1">＋</span>
                  {ko ? "사진 추가" : "Add photo"}
                  <span className="block text-xs mt-1">JPG · PNG · WEBP, 25MB</span>
                </>
              )}
            </span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple={max > 1} hidden onChange={(e) => onFiles(e.target.files)} />
      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </div>
  );
}
