"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const first = confirm(
      "정말 탈퇴하시겠습니까?\n\n탈퇴 시 다음 데이터가 영구 삭제됩니다:\n• 계정 (이메일·표시 이름)\n• 작성한 모든 댓글\n\n이 작업은 되돌릴 수 없습니다."
    );
    if (!first) return;

    const second = confirm("마지막 확인입니다.\n정말 계정을 삭제하시겠습니까?");
    if (!second) return;

    setLoading(true);
    setError(null);

    const res = await fetch("/api/account/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "탈퇴 처리 실패. 잠시 후 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    // 로컬 세션도 확실히 정리 (서버에서 signOut 했지만 브라우저 캐시 방지)
    const supabase = createClient();
    await supabase.auth.signOut();

    // 탈퇴 완료 안내와 함께 홈으로
    router.push("/?deleted=1");
    router.refresh();
  }

  return (
    <div className="mt-8 pt-6 border-t border-red-200 dark:border-red-900/40">
      <h2 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wide mb-2">
        위험 구역 · Danger Zone
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        탈퇴하면 계정과 작성한 모든 댓글이 <strong className="text-foreground">영구 삭제</strong>됩니다.
        복구할 수 없습니다.
      </p>
      {error && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "탈퇴 처리 중..." : "회원 탈퇴"}
      </button>
    </div>
  );
}
