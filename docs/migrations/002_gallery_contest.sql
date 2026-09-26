-- 002: 작품 갤러리(직거래 게시판) + 온라인 사진 콘테스트
--
-- 원칙
--   - 브라우저(anon·authenticated)는 공개된 것과 본인 것만 읽는다.
--   - 쓰기는 전부 서버 액션이 로그인·소유자·기간을 확인한 뒤 service_role 로 한다.
--     그래서 이 표들에는 insert/update/delete 정책을 두지 않는다(RLS 가 막는다).
--   - 사진은 서버가 발급한 서명 업로드 URL 로 브라우저가 Storage 에 직접 올린다.
--     경로는 <bucket>/<user_id>/<파일> 이고 서버가 제출 시 접두사를 검증한다.

begin;

-- ─── 갤러리 ─────────────────────────────────────────────────────────────
create table if not exists public.artworks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  artist_name   text not null check (length(artist_name) between 1 and 60),
  artist_bio    text check (length(artist_bio) <= 1000),
  title         text not null check (length(title) between 1 and 120),
  description   text check (length(description) <= 5000),
  medium        text check (length(medium) <= 120),          -- 예: 피그먼트 프린트, 하네뮬레 포토 래그
  width_cm      numeric(7,1) check (width_cm > 0),
  height_cm     numeric(7,1) check (height_cm > 0),
  depth_cm      numeric(7,1) check (depth_cm > 0),
  edition       text check (length(edition) <= 60),            -- 예: 에디션 3/10, 단일 원본
  year          int check (year between 1900 and 2100),
  framing       text check (length(framing) <= 200),           -- 액자 여부·사양
  location      text check (length(location) <= 120),          -- 촬영지
  shipping      text check (length(shipping) <= 300),          -- 배송·설치 조건
  price_krw     int check (price_krw >= 0),                    -- null = 가격 문의
  images        text[] not null default '{}' check (cardinality(images) between 1 and 8),
  status        text not null default 'pending'
                check (status in ('pending','approved','rejected','sold','hidden')),
  reject_reason text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  approved_at   timestamptz
);
create index if not exists artworks_status_idx on public.artworks (status, approved_at desc);
create index if not exists artworks_user_idx on public.artworks (user_id, created_at desc);

create table if not exists public.artwork_inquiries (
  id             uuid primary key default gen_random_uuid(),
  artwork_id     uuid not null references public.artworks(id) on delete cascade,
  sender_id      uuid not null references auth.users(id) on delete cascade,
  sender_name    text not null check (length(sender_name) between 1 and 60),
  sender_contact text not null check (length(sender_contact) between 3 and 120),
  message        text not null check (length(message) between 5 and 3000),
  created_at     timestamptz not null default now(),
  read_at        timestamptz
);
create index if not exists artwork_inquiries_artwork_idx on public.artwork_inquiries (artwork_id, created_at desc);
create index if not exists artwork_inquiries_sender_idx on public.artwork_inquiries (sender_id);

-- ─── 콘테스트 ───────────────────────────────────────────────────────────
create table if not exists public.contests (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  title_ko         text not null,
  title_en         text,
  theme_ko         text,
  description_ko   text,
  description_en   text,
  cover_path       text,
  submit_starts_at timestamptz not null,
  submit_ends_at   timestamptz not null,
  vote_ends_at     timestamptz not null,
  max_entries      int not null default 3 check (max_entries between 1 and 20),
  prize_ko         text,
  status           text not null default 'draft' check (status in ('draft','published')),
  results_public   boolean not null default false,
  created_at       timestamptz not null default now(),
  check (submit_starts_at < submit_ends_at and submit_ends_at <= vote_ends_at)
);

create table if not exists public.contest_entries (
  id          uuid primary key default gen_random_uuid(),
  contest_id  uuid not null references public.contests(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  author_name text not null check (length(author_name) between 1 and 60),
  title       text not null check (length(title) between 1 and 120),
  caption     text check (length(caption) <= 1500),
  location    text check (length(location) <= 120),
  image_path  text not null,
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  award       text check (award in ('grand','gold','silver','bronze','honorable')),
  created_at  timestamptz not null default now()
);
create index if not exists contest_entries_contest_idx on public.contest_entries (contest_id, status, created_at desc);
create index if not exists contest_entries_user_idx on public.contest_entries (user_id);

-- 회원 1인 1표(콘테스트당). 표를 옮기면 서버가 기존 표를 바꾼다.
create table if not exists public.contest_votes (
  contest_id uuid not null references public.contests(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  entry_id   uuid not null references public.contest_entries(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (contest_id, user_id)
);
create index if not exists contest_votes_entry_idx on public.contest_votes (entry_id);

-- ─── RLS (읽기만) ───────────────────────────────────────────────────────
alter table public.artworks          enable row level security;
alter table public.artwork_inquiries enable row level security;
alter table public.contests          enable row level security;
alter table public.contest_entries   enable row level security;
alter table public.contest_votes     enable row level security;

drop policy if exists artworks_read on public.artworks;
create policy artworks_read on public.artworks for select
  using (status in ('approved','sold') or user_id = (select auth.uid()));

drop policy if exists inquiries_read on public.artwork_inquiries;
create policy inquiries_read on public.artwork_inquiries for select to authenticated
  using (sender_id = (select auth.uid())
         or exists (select 1 from public.artworks a where a.id = artwork_id and a.user_id = (select auth.uid())));

drop policy if exists contests_read on public.contests;
create policy contests_read on public.contests for select using (status = 'published');

drop policy if exists entries_read on public.contest_entries;
create policy entries_read on public.contest_entries for select
  using (status = 'approved' or user_id = (select auth.uid()));

drop policy if exists votes_read_own on public.contest_votes;
create policy votes_read_own on public.contest_votes for select to authenticated
  using (user_id = (select auth.uid()));

-- ─── Storage ────────────────────────────────────────────────────────────
-- 공개 버킷: 승인 전 사진도 URL 을 알면 보이지만, 경로에 추측 불가능한 uuid 가 들어가고
-- 목록 조회 정책은 두지 않는다(공개 URL 은 RLS 를 거치지 않으므로 목록 SELECT 정책이 필요 없다).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('artworks', 'artworks', true, 26214400, array['image/jpeg','image/png','image/webp']),
  ('contest',  'contest',  true, 26214400, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

commit;
