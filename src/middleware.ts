import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { createServerClient } from "@supabase/ssr";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || "psa-default-secret-change-me";
  return new TextEncoder().encode(secret);
}

async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase env 미설정 시 그냥 통과 (로컬 개발 초기, 인증 기능 비활성)
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // 세션 토큰 자동 갱신 (만료 임박 시)
  await supabase.auth.getUser();
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  // 1. Supabase 세션 갱신 (모든 요청에 대해)
  response = await refreshSupabaseSession(request, response);

  // 2. /admin 경로 보호 (관리자 전용 — 기존 로직 유지)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("psa-admin-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await jwtVerify(token, getJwtSecret());
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 3. /account 경로 보호 (로그인한 사용자 전용)
  if (pathname.startsWith("/account")) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.redirect(new URL("/login?next=/account", request.url));
      }
    }
  }

  return response;
}

export const config = {
  // /api/comments 등 모든 정적 자원 제외하고 매칭
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
