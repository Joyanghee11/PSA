import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { createServerClient } from "@supabase/ssr";
import { PSA_SUPABASE_URL, PSA_SUPABASE_KEY } from "@/config/psa";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || "psa-default-secret-change-me";
  return new TextEncoder().encode(secret);
}

const RANK: Record<string, number> = { reporter: 1, senior_reporter: 2, editor_in_chief: 3 };

// 관리 화면별 최소 직책. 목록에 없는 /admin 경로(기사 목록·작성·수정)는 기자 이상.
const ADMIN_MIN_ROLE: [string, string][] = [
  ["/admin/staff", "editor_in_chief"],
  ["/admin/safety", "editor_in_chief"],
  ["/admin/gallery", "senior_reporter"],
  ["/admin/contests", "senior_reporter"],
  ["/admin/ads", "senior_reporter"],
];

async function hasAdminPasswordToken(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("psa-admin-token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  // 1. 로그인 세션 갱신 (PSA 회원 DB, 모든 요청)
  const supabase = createServerClient(PSA_SUPABASE_URL, PSA_SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. /admin — 관리자 비밀번호 세션(편집장) 또는 PSA 로그인 + 저널 직책
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!(await hasAdminPasswordToken(request))) {
      const { data: role } = user ? await supabase.rpc("journal_my_role") : { data: null };
      const rank = typeof role === "string" ? RANK[role] ?? 0 : 0;
      if (!rank) return NextResponse.redirect(new URL("/admin/login", request.url));
      const need = ADMIN_MIN_ROLE.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "reporter";
      if (rank < RANK[need]) return NextResponse.redirect(new URL("/admin?denied=1", request.url));
    }
  }

  // 3. /safety 보호 경로 (PSA_safety 세션 필수): course / exam / certificate
  if (
    pathname.startsWith("/safety/course") ||
    pathname.startsWith("/safety/exam") ||
    pathname.startsWith("/safety/certificate")
  ) {
    const token = request.cookies.get("psa-safety-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/safety", request.url));
    }
    try {
      await jwtVerify(token, getJwtSecret());
    } catch {
      return NextResponse.redirect(new URL("/safety", request.url));
    }
  }

  // 4. /account 경로 보호 (로그인한 사용자 전용)
  if (pathname.startsWith("/account") && !user) {
    return NextResponse.redirect(new URL("/login?next=/account", request.url));
  }

  return response;
}

export const config = {
  // /api/comments 등 모든 정적 자원 제외하고 매칭
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
