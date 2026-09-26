// 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트 — 로그인·회원 정보(PSA 회원 DB)
import { createBrowserClient } from "@supabase/ssr";
import { PSA_SUPABASE_URL, PSA_SUPABASE_KEY } from "@/config/psa";

export function createClient() {
  return createBrowserClient(PSA_SUPABASE_URL, PSA_SUPABASE_KEY);
}
