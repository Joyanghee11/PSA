# 색상 시스템 — Tidal Editorial (Round 2)

컨셉: 차가운 바다를 **따뜻한 종이 위에 편집한 잡지**.
독자 타겟: 30대 여성 프리다이버.
레퍼런스: Kinfolk, Cereal, Magazine B의 절제된 편집 감성.

**핵심 원칙**: 크림색 종이(Canvas) 위에 심해 잉크(Ink)로 타이포그래피가 중심이 되고,
티드(Tide) 청록이 포인트로, 산호(Coral)가 아주 드문 감정 포인트로 사용된다.

---

## Palette (Light — 기본)

| 역할 | Hex | 이름 | 용도 |
|------|-----|------|------|
| 바탕 | `#f4efe7` | **Canvas** (아이보리 크림) | 페이지 전체 배경 |
| 종이 | `#fbf8f3` | **Paper** | 카드·기사 박스 배경 |
| 잉크 | `#1a2427` | **Ink** | 본문 텍스트 |
| 헤드라인 | `#0d1517` | **Deep Ink** | 제목, 대비 극대화 |
| 스톤 | `#6b6e6a` | **Stone** | 보조 텍스트 |
| 연한 돌 | `#dcd4c9` | **Sand Line** | 헤어라인 경계 |
| 티드 | `#2d4a50` | **Tide** | 주 포인트, 링크, CTA |
| 샐로우 | `#6a9b9b` | **Shallow** | 호버·보조 포인트 |
| 산호 | `#b85c52` | **Coral** | 드문 감정 포인트 (pull quote 등) |
| 쉘 | `#d4b5a5` | **Shell** | 카테고리 태그 배경 |

## Palette (Dark)

| 역할 | Hex |
|------|-----|
| 바탕 | `#12181a` |
| 종이 | `#1c2224` |
| 잉크 | `#e8e2d9` |
| 헤드라인 | `#faf6f0` |
| 스톤 | `#a09d94` |
| 티드 | `#6a9b9b` |
| 산호 | `#d47c70` |

## Semantic (상태 전용, 브랜드 팔레트와 분리)

| 역할 | Hex |
|------|-----|
| 파괴 | `#9a3b33` (Deep coral) |
| 성공 | `#5e7a5f` (Moss) |
| 주의 | `#c89a46` (Amber) |

---

## CSS 변수 (globals.css)

### :root
```css
:root {
  --background: #f4efe7;      /* Canvas */
  --foreground: #1a2427;      /* Ink */
  --card: #fbf8f3;            /* Paper */
  --card-foreground: #1a2427;
  --muted: #ede7dc;
  --muted-foreground: #6b6e6a; /* Stone */
  --accent: #2d4a50;          /* Tide */
  --accent-foreground: #fbf8f3;
  --accent-blue: #2d4a50;     /* 링크도 Tide */
  --accent-warm: #b85c52;     /* Coral (드문 포인트) */
  --border: #dcd4c9;          /* Sand Line */
  --border-strong: #1a2427;
  --headline: #0d1517;        /* Deep Ink */
  --nav-bg: #f4efe7;          /* 네비도 Canvas */
  --nav-text: #1a2427;
  --serif: "Fraunces", "Noto Serif KR", ui-serif, Georgia, serif;
  --sans: "Inter", "Pretendard", ui-sans-serif, system-ui, sans-serif;
}
```

### .dark
```css
.dark {
  --background: #12181a;
  --foreground: #e8e2d9;
  --card: #1c2224;
  --card-foreground: #e8e2d9;
  --muted: #1c2224;
  --muted-foreground: #a09d94;
  --accent: #6a9b9b;
  --accent-foreground: #12181a;
  --accent-blue: #6a9b9b;
  --accent-warm: #d47c70;
  --border: #2e3638;
  --border-strong: #a09d94;
  --headline: #faf6f0;
  --nav-bg: #12181a;
  --nav-text: #e8e2d9;
}
```

## Typography 시스템

| 역할 | 폰트 | 스타일 |
|------|------|--------|
| 디스플레이 제목 | Fraunces 700–900 | `letter-spacing: -0.02em`, 크게 |
| 소제목 | Fraunces 500–600 italic | 본문 중간 섹션 구분 |
| 본문 | Inter 400 + Pretendard 400 | 17px, line-height 1.75 |
| 보조·메타 | Inter 500 small caps | `letter-spacing: 0.2em` |
| pull quote | Fraunces 300 italic | 큰 크기, 헤어라인 경계 |
