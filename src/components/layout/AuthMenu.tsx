"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AuthMenu({ lang }: { lang: string }) {
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Supabase 미설정 시 (env 없음) — 메뉴 자체를 숨김
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  // 첫 렌더 깜빡임 방지: 준비 전엔 자리만 차지
  if (!ready) return <span className="w-20" />;

  if (email) {
    return (
      <Link
        href="/account"
        className="text-xs text-muted-foreground hover:text-foreground"
        title={email}
      >
        {lang === "ko" ? "내 정보" : "Account"}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Link href="/login" className="hover:text-foreground">
        {lang === "ko" ? "로그인" : "Login"}
      </Link>
      <span className="text-border">·</span>
      <Link href="/signup" className="hover:text-foreground">
        {lang === "ko" ? "가입" : "Sign up"}
      </Link>
    </div>
  );
}
