// 다이브 저널은 PSA(divepsa.com) 회원 계정으로 로그인한다.
// 아래 값은 브라우저에 그대로 실리는 공개용(publishable) 값이다. 비밀 키가 아니다.
// 다이브 저널 자체 데이터(댓글·갤러리·콘테스트)는 NEXT_PUBLIC_SUPABASE_URL 의 저널 DB 에 그대로 있다.
export const PSA_SITE_URL = "https://www.divepsa.com";
export const PSA_SUPABASE_URL = process.env.NEXT_PUBLIC_PSA_SUPABASE_URL || "https://wdswlnaegnagnmsnglww.supabase.co";
export const PSA_SUPABASE_KEY = process.env.NEXT_PUBLIC_PSA_SUPABASE_KEY || "sb_publishable_o8JCzqSDwGLdCKWh05jdgg_2rlzzy-p";
