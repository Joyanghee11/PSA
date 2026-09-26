// 브라우저용 저널 DB 클라이언트 — 서명 URL 로 저장소(Storage)에 사진을 올릴 때만 쓴다.
// 로그인은 PSA 회원 DB(client.ts)에서 하므로 이 클라이언트에는 세션이 없다.
import { createClient } from "@supabase/supabase-js";

export function createDataBrowserClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
