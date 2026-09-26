"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PSA_SITE_URL } from "@/config/psa";
import { AuthShell, FormAlert, PsaMemberNote } from "@/components/auth/AuthShell";

/** 로그인 뒤 돌아갈 곳. 사이트 안 경로만 허용한다. */
function safeNext(raw: string | null): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/ko";
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);

    if (signInError) {
      setError(
        /invalid login credentials/i.test(signInError.message)
          ? "이메일 또는 비밀번호가 맞지 않습니다."
          : "로그인하지 못했습니다. 잠시 뒤 다시 시도해 주세요."
      );
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <AuthShell kicker="Sign in" title="로그인" lead="다이브 저널 계정으로 로그인합니다.">
      <PsaMemberNote>
        PSA 회원이라면 divepsa.com 에서 쓰는 이메일과 비밀번호로 그대로 로그인할 수 있습니다.
      </PsaMemberNote>

      <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
        <div className="field">
          <label htmlFor="email">이메일</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" autoComplete="current-password" />
        </div>

        {error && <FormAlert>{error}</FormAlert>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-3 text-[14px] text-muted-foreground">
        <a href={`${PSA_SITE_URL}/reset-password`} target="_blank" rel="noopener" className="hover:text-foreground">
          비밀번호를 잊으셨나요?
        </a>
        <Link href={`/signup${next !== "/ko" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-accent-blue hover:underline">
          다이브 저널 계정 만들기
        </Link>
      </div>
    </AuthShell>
  );
}

// useSearchParams()는 Next.js 16의 정적 생성에서 Suspense boundary를 요구함
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
