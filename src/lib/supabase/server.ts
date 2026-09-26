// 서버 컴포넌트, Route Handler, Server Action 용 Supabase 클라이언트 — 로그인·회원 정보(PSA 회원 DB)
// 저널 데이터(댓글·갤러리·콘테스트)는 이 클라이언트가 아니라 admin.ts 의 저널 DB 클라이언트로 읽고 쓴다.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PSA_SUPABASE_URL, PSA_SUPABASE_KEY } from "@/config/psa";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    PSA_SUPABASE_URL,
    PSA_SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서 setAll 호출은 throw — middleware가 세션 갱신을 담당함
          }
        },
      },
    }
  );
}
