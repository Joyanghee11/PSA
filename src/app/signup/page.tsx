"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0] },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // 이메일 인증이 켜져 있으면 session=null이 옴 → 안내 메시지
    if (!data.session) {
      setInfo(
        "확인 메일을 보냈습니다. 이메일의 링크를 클릭해 인증을 완료해주세요. (Supabase에서 이메일 인증을 OFF로 설정한 경우 무시)"
      );
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-2">회원가입</h1>
        <p className="text-sm text-muted-foreground mb-6">
          가입하시면 기사에 댓글을 남길 수 있습니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">표시 이름 (선택)</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              placeholder="댓글에 표시될 이름"
              maxLength={40}
            />
            <p className="text-xs text-muted-foreground mt-1">
              비우면 이메일 앞부분이 사용됩니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              placeholder="8자 이상"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          {info && (
            <div className="px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-accent hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
