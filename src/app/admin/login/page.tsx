"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell, FormAlert } from "@/components/auth/AuthShell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      kicker="Newsroom"
      title="편집국 로그인"
      lead="편집장·책임 기자·기자로 지정된 회원만 들어올 수 있습니다. 직책은 편집장이 관리 화면의 편집진 메뉴에서 부여합니다."
    >
      <Link href="/login?next=/admin" className="btn btn-primary w-full !h-12">
        다이브 저널 계정으로 로그인
      </Link>
      <p className="text-[13px] text-muted-foreground mt-2.5 text-center">PSA 회원 계정도 그대로 쓸 수 있습니다.</p>

      <details className="mt-8 border-t border-border pt-5">
        <summary className="cursor-pointer text-[14px] text-muted-foreground select-none">관리자 비밀번호로 들어가기</summary>
        <form onSubmit={handleSubmit} className="grid gap-3 mt-4">
          <div className="field">
            <label htmlFor="password">관리자 비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <FormAlert>{error}</FormAlert>}
          <button type="submit" disabled={loading} className="btn btn-ghost w-full">
            {loading ? "확인 중..." : "들어가기"}
          </button>
        </form>
      </details>
    </AuthShell>
  );
}
