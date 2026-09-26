-- 2026-09-27 회원 계정을 PSA(divepsa.com) 회원 DB 로 옮김.
-- 로그인은 PSA Supabase 에서 하고, 저널 DB 에는 PSA 회원 id 를 그대로 저장한다.
-- 저널 DB 의 auth.users 에는 그 id 가 없으므로 auth.users 외래 키를 푼다.
-- (적용 시점 기준 다섯 표 모두 0행이었다. 본인 확인은 서버 코드가 PSA 세션으로 한다.)
alter table public.comments          drop constraint if exists comments_user_id_fkey;
alter table public.artworks          drop constraint if exists artworks_user_id_fkey;
alter table public.artwork_inquiries drop constraint if exists artwork_inquiries_sender_id_fkey;
alter table public.contest_entries   drop constraint if exists contest_entries_user_id_fkey;
alter table public.contest_votes     drop constraint if exists contest_votes_user_id_fkey;
