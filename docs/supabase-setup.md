# Supabase 설정 가이드

이 프로젝트는 **회원 가입·로그인·댓글** 기능에 [Supabase](https://supabase.com)를
사용한다. Supabase는 PostgreSQL 데이터베이스 + JWT 기반 인증을 한 번에 제공한다.
무료 티어로 이 프로젝트 운영에 충분하다.

---

## 1. Supabase 프로젝트 생성 (5분)

1. https://supabase.com 접속 → **Start your project** 클릭 → GitHub 계정으로 로그인
2. **New project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: `psa-news` (자유롭게)
   - **Database Password**: 강한 비밀번호 생성 → **반드시 안전한 곳에 별도 저장**
     (DB 직접 접속 시 필요. 나중에 분실하면 재설정 절차 필요)
   - **Region**: `Northeast Asia (Seoul)` 권장 (지연 시간 최소)
   - **Plan**: **Free**
4. **Create new project** → 프로젝트 프로비저닝 1~2분 대기

## 2. 데이터베이스 스키마 생성

프로젝트가 준비되면:

1. 왼쪽 사이드바에서 **SQL Editor** 클릭
2. **+ New query** 버튼
3. [docs/supabase-schema.sql](./supabase-schema.sql) 파일 내용을 전체 복사 → 붙여넣기
4. 우측 하단 초록색 **Run** 버튼 → 성공 메시지 확인

이로써 `comments` 테이블과 보안 정책(RLS)이 만들어진다.

## 3. API 키 복사

1. 왼쪽 사이드바에서 **Project Settings (⚙️) → API**
2. 다음 3개 값을 `.env.local`에 복사:

| Supabase 화면의 항목 | `.env.local` 변수명 | 비고 |
|---------------------|---------------------|------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` 형태 |
| **Project API keys → anon public** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 긴 JWT 문자열 (브라우저 노출 OK) |
| **Project API keys → service_role secret** | `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용, **절대 클라이언트 노출 금지** |

`.env.local` 추가 예:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

## 4. (선택) 이메일 인증 설정

Supabase는 기본으로 회원 가입 시 **이메일 인증 링크**를 보낸다. 개발 단계에서는
이를 끄는 게 편하다.

1. 사이드바 **Authentication → Providers → Email**
2. **Confirm email** 토글을 **OFF**
3. 저장

운영 단계에서는 다시 켜는 게 권장된다.

## 5. (Vercel 배포 시) 환경변수 추가

로컬에서 잘 돌면 Vercel 대시보드에도 같은 변수를 추가한다.

1. Vercel 프로젝트 → **Settings → Environment Variables**
2. 위 3개 변수를 동일한 이름·값으로 등록
3. **Production**, **Preview**, **Development** 모두 체크
4. 저장 → 다음 배포부터 적용됨

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
|------|-------------|
| 회원가입 시 "Email confirmation required" | 4번 항목 OFF로 변경, 또는 메일에서 인증 링크 클릭 |
| 댓글 등록 시 401 / RLS 위반 | 로그인 안 한 상태이거나 RLS 정책 미적용 — 2번 SQL 다시 실행 |
| `Failed to fetch` 에러 | URL 오타, 또는 anon key 잘못 복사 |
| 비밀번호 분실 | Supabase 대시보드 **Settings → Database → Reset database password** |

---

## 비용

- **Free tier**: 월 50,000 MAU, 500MB DB, 5GB 대역폭. 이 프로젝트엔 충분.
- 초과 시 자동 일시 정지(Free) 또는 유료 플랜으로 자동 업그레이드 안 됨.
