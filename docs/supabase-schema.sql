-- ===============================================================
-- PSA News - Supabase 스키마
-- 사용법: Supabase SQL Editor에 전체 붙여넣고 Run
-- 안전: 모두 멱등(IF NOT EXISTS)이라 여러 번 실행해도 안전
-- ===============================================================

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS public.comments (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT         NOT NULL,
  user_id      UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email   TEXT         NOT NULL,
  display_name TEXT,
  body         TEXT         NOT NULL CHECK (length(body) > 0 AND length(body) <= 2000),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS comments_article_slug_idx ON public.comments(article_slug);
CREATE INDEX IF NOT EXISTS comments_user_id_idx       ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx    ON public.comments(created_at DESC);

-- ===============================================================
-- Row Level Security (RLS) — 클라이언트가 anon 키로 직접 접근하므로 필수
-- ===============================================================
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 1) 누구나 댓글을 읽을 수 있다 (공개 사이트)
DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;
CREATE POLICY "Anyone can read comments"
  ON public.comments
  FOR SELECT
  USING (true);

-- 2) 로그인한 사용자만 자기 user_id로 댓글 작성 가능
DROP POLICY IF EXISTS "Auth users insert own comments" ON public.comments;
CREATE POLICY "Auth users insert own comments"
  ON public.comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3) 본인 댓글만 수정 가능
DROP POLICY IF EXISTS "Users update own comments" ON public.comments;
CREATE POLICY "Users update own comments"
  ON public.comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4) 본인 댓글만 삭제 가능
DROP POLICY IF EXISTS "Users delete own comments" ON public.comments;
CREATE POLICY "Users delete own comments"
  ON public.comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
