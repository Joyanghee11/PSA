"use client";

import { useState } from "react";

export function CertificateActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/safety/certificate", { method: "GET" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (data.error === "course-incomplete") {
          setError("이수 요건이 충족되지 않았습니다. 학습을 완료해 주세요.");
        } else if (data.error === "unauthenticated") {
          setError("세션이 만료되었습니다. 다시 로그인해 주세요.");
        } else {
          setError("이수증 발급 중 오류가 발생했습니다.");
        }
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const cd = res.headers.get("Content-Disposition") || "";
      const m = cd.match(/filename\*=UTF-8''([^;]+)/);
      const filename = m ? decodeURIComponent(m[1]) : "PSA_safety_certificate.pdf";

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("네트워크 오류로 다운로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-6 py-3 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "발급 중..." : "📥 이수증 PDF 다운로드"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-[color:var(--accent-warm)]">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        다운로드 후 인쇄 또는 PDF로 보관해 주세요.
      </p>
    </div>
  );
}
