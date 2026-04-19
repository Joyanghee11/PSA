# 색상 시스템 — Deep Blue Journal

컨셉: **바다 표면(Surface) → 심해(Abyss)** 로 이어지는 그라데이션.
같은 색상(남색) 안에서 명도만 변화시켜 위계를 만드는 **모노크로매틱 전략**.
대비가 필요한 곳에서만 물빛 시안을 얕게 사용.

---

## Primary Palette (Ocean Scale)

표면에서 심해로, 옅은 색부터 짙은 색까지.

| 이름 | Hex | 용도 |
|------|------|------|
| `ocean-50` | `#f5fafd` | 카드·섹션 은은한 배경 |
| `ocean-100` | `#e4eff7` | 인용·보조 정보 박스 |
| `ocean-300` | `#a5c8de` | 비활성 버튼·경계 강조 |
| `ocean-500` | `#3a7ba4` | 링크 hover·아이콘 |
| `ocean-600` | `#1565a1` | 버튼 기본 |
| `ocean-800` | `#0e3a5f` | **주 브랜드색 (accent)** — 로고, CTA |
| `ocean-900` | `#082640` | 헤드라인, 네비게이션 |
| `ocean-950` | `#061a2c` | 다크 모드 배경 |

## Support Palette

| 이름 | Hex | 용도 |
|------|------|------|
| `cyan-500` | `#0891b2` | 링크 기본 (본문 내 inline link) |
| `cyan-400` | `#22b8d9` | 다크 모드 링크 |
| `mist-50` | `#fafbfc` | 라이트 모드 배경 (미세 블루-그레이) |
| `mist-100` | `#f1f4f7` | 서브 배경 (muted) |
| `mist-300` | `#d9e0e8` | 경계선 (border) |
| `charcoal-500` | `#6b7a87` | 보조 텍스트 (muted-foreground) |
| `charcoal-900` | `#141c24` | 본문 텍스트 |

## Semantic Colors (상태 전용)

전체 팔레트와 분리. 오직 상태 표시에만 사용.

| 이름 | Hex | 용도 |
|------|------|------|
| `danger-600` | `#dc2626` | 삭제·탈퇴·파괴적 액션 |
| `danger-100` | `#fee2e2` | 경고 박스 배경 |
| `success-600` | `#059669` | 게재됨·패스 게이트 통과 |
| `warning-500` | `#d97706` | draft·게이트 실패 뱃지 |

---

## CSS 변수 매핑 (src/app/globals.css)

### :root (라이트 모드)

```css
:root {
  --background: #fafbfc;           /* mist-50 */
  --foreground: #141c24;           /* charcoal-900 */
  --card: #ffffff;
  --card-foreground: #141c24;
  --muted: #f1f4f7;                /* mist-100 */
  --muted-foreground: #6b7a87;     /* charcoal-500 */
  --accent: #0e3a5f;               /* ocean-800 — 주 브랜드 */
  --accent-foreground: #ffffff;
  --accent-blue: #0891b2;          /* cyan-500 — 본문 링크 */
  --border: #d9e0e8;               /* mist-300 */
  --border-strong: #0e3a5f;        /* ocean-800 */
  --headline: #061a2c;             /* ocean-950 */
  --nav-bg: #082640;               /* ocean-900 */
  --nav-text: #e4eff7;             /* ocean-100 */
}
```

### .dark (다크 모드)

```css
.dark {
  --background: #061a2c;           /* ocean-950 */
  --foreground: #e4eff7;           /* ocean-100 */
  --card: #0e2740;                 /* ocean-900 진한 쪽 */
  --card-foreground: #e4eff7;
  --muted: #0e2740;
  --muted-foreground: #a5c8de;     /* ocean-300 */
  --accent: #3a7ba4;               /* ocean-500 — 다크에선 더 밝게 */
  --accent-foreground: #ffffff;
  --accent-blue: #22b8d9;          /* cyan-400 */
  --border: #1e3248;
  --border-strong: #3a7ba4;
  --headline: #ffffff;
  --nav-bg: #030f1a;
  --nav-text: #e4eff7;
}
```

## 사용 규칙

1. **`--accent`는 로고·네비 활성·주요 CTA에만**
   링크는 `--accent-blue` 사용. 혼용 금지.

2. **`--danger-*`는 상태만**
   일반 강조에 빨간색 쓰지 말 것. 빨간색 = 삭제·위험의 의미를 보존.

3. **헤드라인 색은 본문보다 항상 진함**
   `--headline` < `--foreground` (명도 순).

4. **섹션 타이틀 좌측 바 색은 `--accent`**
   (기존 빨간색에서 ocean-800으로 변경됨 — 자동)
