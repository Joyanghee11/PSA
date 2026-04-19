// 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트
import { createBrowserClient } from "@supabase/ssr";

// 빌드 단계에서 env 변수가 없어도 정적 생성이 깨지지 않도록 플레이스홀더를 사용한다.
// env가 실제로 설정되지 않은 배포에서는 Supabase 호출이 런타임에 실패하지만
// 페이지 자체는 정상 렌더링된다 (AuthMenu 등은 env 미설정 시 조용히 숨김 처리).
const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "placeholder-anon-key";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;
  return createBrowserClient(url, key);
}
