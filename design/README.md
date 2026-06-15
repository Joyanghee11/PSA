# 다이브 저널 · DiveJournal — Design System

**Current direction: Digital Broadsheet** (전문 한국어 인터넷 신문).
The canonical spec lives in [palette.md](palette.md) — colors, fonts, accent
discipline, and component treatments. Read that first.

**컨셉**: 차가운 페이퍼 그레이 위의 묵직한 잉크 + 절제된 다크레드 마스트헤드 룰.
조선비즈 / 한겨레 디지털 / Reuters 의 디지털 브로드시트 레지스터.
한글이 메인(IBM Plex Sans KR 헤드라인 + Gothic A1 본문), 영어가 서브.

---

## 파일 구조

```
design/
├── README.md            ← 이 문서
├── palette.md           ← 색·폰트·컴포넌트 정식 스펙 (canonical)
├── logo.svg             ← (구) 타이포 워드마크 — 현재 로고는 순수 텍스트(IBM Plex Sans KR)로 대체됨
├── logo-full.svg        ← (구)
├── logo-dark.svg        ← (구)
└── mocks/
    ├── mock-home.html   ← 브로드시트 1면 시안 (lead zone · 주요 기사 · 많이 본 기사)
    └── mock-article.html ← 신문 기사 시안 (kicker · metarule · pullquote · 댓글)
```

> 로고: 디지털 브로드시트에서는 별도 아이콘 없이 **타이포그래픽 네임플레이트**
> ('다이브 저널' IBM Plex Sans KR 600 + 'DIVE journal' 영문 서브)가 마크 역할을
> 한다. 기존 `logo*.svg`(Tidal 시절 세리프 워드마크)는 참고용으로만 남겨둠.

## 디자인 원칙 (요약 — 자세히는 palette.md)

1. **밀도와 구조** — 여백보다 정보. 헤어라인 + 볼드 룰의 신문 리듬.
2. **다크레드는 룰 전용** — `--accent`(#7a1420)는 마스트헤드 룰·섹션 탭·풀쿼트
   선에만. 버튼·본문·채움색으로 절대 쓰지 않음. 위험/삭제는 별도 `--danger`.
3. **차가운 기관색 블루** — 링크·다이빙 정체성의 through-line(`--accent-blue`).
4. **섹션 컬러코딩** — 블루(프리다이빙/과학/포인트)·틸(스쿠버)·오커(장비/식단),
   나머지는 중립. 색은 섹션을 인코딩하며 장식이 아님.
5. **한글 우선** — 모든 한글 `word-break: keep-all`, 사이즈·굵기로 위계.

## 적용 범위

- **색상·유틸리티**: `src/app/globals.css` (CSS 변수 + .nav-index/.section-divider 등)
- **폰트**: `src/app/layout.tsx` (next/font/google)
- **마스트헤드·네비**: `src/components/layout/Header.tsx`
