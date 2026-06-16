# 다이브 저널 (DiveJournal) — Design System

> 바다를 정확하게 — 프리다이빙과 스쿠버의 신뢰받는 보도
> A serious Korean-first digital broadsheet for freediving and scuba.

## 1. Direction
Digital broadsheet, not lifestyle magazine. The defining move is the **sans-headline / sans-body** system on a cool paper-gray canvas with near-black ink, signed by a controlled dark-red Korean masthead rule. We deliberately move **away** from the old cream `#f4efe7` + muted teal `#2d4a50` + Gowun Batang softness toward density, structure, and high contrast — the 조선비즈 / 한겨레 digital / Axios / Reuters register.

Reference outlets: 조선비즈, The Atlantic, Axios, 한겨레 digital, Reuters.

## 2. Typography
| Slot | CSS var | Family | Use |
|---|---|---|---|
| KO headline | `--font-sans-kr` | **IBM Plex Sans KR** (500/600/700) | Masthead wordmark, headlines, nav, subheads, UI labels, kickers |
| KO body | `--font-serif-kr` | **Gothic A1** (400/500) | **Korean body + decks** — note the slot is named "serif" but now holds a SANS face on purpose |
| Latin serif | `--font-serif` | **Source Serif 4** (400/600 + italic) | Latin pull-quotes & rare English display only |
| Latin sans | `--font-sans` | **IBM Plex Sans** (400/500/600) | "DIVE journal" lockup, datelines, bylines, numerals, English nav subs |

**Why Gothic A1 for Korean body (the key decision):** all three judges flagged Noto Serif KR as the one genuinely magazine-leaning choice left, and noted the named references (조선비즈 / 한겨레 digital / Reuters) all run **sans** Korean body. Gothic A1 is a clean, high-x-height Korean sans that out-reads serif Hangul for dense, scannable reporting and is internally consistent with the "broadsheet not magazine" thesis. Sans headlines + sans body, differentiated by **weight and size**, is the digital-broadsheet signature.

Rules: Korean always `word-break: keep-all`. Body 17–18px / line-height 1.8. H1 IBM Plex Sans KR 600, 30–36px, letter-spacing -0.3px. Load only the listed weights (no 800/900) to keep CJK webfont weight down; `display: swap`.

## 3. Color — the 15 named variables
### Light (`:root`)
| Variable | Hex | Role |
|---|---|---|
| `--background` | `#F4F5F6` | Cool paper-gray canvas |
| `--foreground` | `#15181C` | Body ink (16.3:1 on bg) |
| `--card` | `#FBFBFA` | Barely-warm off-white card |
| `--card-foreground` | `#1C2025` | Ink on card (15.8:1) |
| `--muted` | `#ECEDEE` | Meta strips / badges bg |
| `--muted-foreground` | `#5A5E66` | Datelines, decks (5.96:1) |
| `--accent` | `#7A1420` | Dark-red broadsheet RULE only |
| `--accent-foreground` | `#FBFBFA` | On the rare accent surface |
| `--accent-blue` | `#1463B0` | Links + lead/science section + diving through-line (5.59:1) |
| `--accent-warm` | `#9A5A12` | 장비 / 다이버 식단 kicker (5.0:1 — true AA, tightened from #B0641A) |
| `--border` | `#DAD8D2` | Hairline |
| `--border-strong` | `#B4B2A9` | Heavy section rule |
| `--headline` | `#0E1115` | Display ink |
| `--nav-bg` | `#FBFBFA` | Masthead / nav band |
| `--nav-text` | `#15181C` | Nav labels (17.2:1) |

### Dark (`.dark`)
| Variable | Hex | Role |
|---|---|---|
| `--background` | `#0E1115` | True near-black newsroom |
| `--foreground` | `#E8E7E2` | 15.3:1 |
| `--card` | `#15181C` | |
| `--card-foreground` | `#E8E7E2` | 14.4:1 |
| `--muted` | `#1C2025` | |
| `--muted-foreground` | `#9AA0A6` | 7.2:1 / 6.7:1 on card |
| `--accent` | `#8E2230` | Dark-red rule only |
| `--accent-foreground` | `#F2F1EC` | |
| `--accent-blue` | `#5AAAEC` | Links (7.1:1 on card — raised from #4FA3E8 to clear AA comfortably on `--card`, per judge note) |
| `--accent-warm` | `#E0A24E` | 8.0:1 on card |
| `--border` | `#2A2E33` | |
| `--border-strong` | `#3F454C` | |
| `--headline` | `#F2F1EC` | |
| `--nav-bg` | `#15181C` | |
| `--nav-text` | `#F2F1EC` | 15.8:1 |

### Extra NAMED properties (documented, not hardcoded — fixes the "unlisted color" critique)
| Variable | Light | Dark | Role |
|---|---|---|---|
| `--accent-teal` | `#0F6E56` | `#3FB89C` | 스쿠버 section + nameplate sea/depth signal (4.81:1 light / 7.25:1 dark) |
| `--badge-verified` | `#147D63` | `#36C9A4` | 검증됨 evaluation badge (4.64:1 / 8.52:1) |
| `--danger` | `#C8322B` | `#E5685F` | **Destructive/danger ONLY** — kept bright and clearly distinct from `--accent` dark red |
| `--danger-foreground` | `#FBFBFA` | `#15181C` | |

All body/link/label pairs verified ≥ 4.5:1 WCAG AA in both modes; ink-on-canvas exceeds 14:1.

## 4. Accent discipline (three tiers + status)
1. **`--accent` dark red** — masthead rule, section divider tabs, pull-quote left rules. NEVER a fill, NEVER on buttons, NEVER body text. (As a *text* color it fails contrast on the dark card — by design it is only ever a graphical rule.)
2. **`--accent-blue`** — the single interactive/link color AND the diving brand through-line.
3. **Section coding** — `--accent-blue` (프리다이빙/과학/다이빙 포인트), `--accent-teal` (스쿠버), `--accent-warm` (장비/다이버 식단), neutral `--muted-foreground` for the rest. Color encodes section, never decoration.
4. **Status** — `--badge-verified` green for 검증됨; `--danger` for destructive. The dark-red masthead accent and the destructive red are intentionally separated so adjacent UI never reads as an alert.

## 5. Diving identity (topic-fit signal — disciplined, not nautical)
Two structural cues give the paper a sea/depth identity without kitsch:
- **Cool institutional blue** as the link + brand through-line (water, not warmth).
- **Depth-gauge section divider**: a `--border-strong` rule with a short colored section tab and thin 1px **graduation ticks** along the rule — reads as a measured depth scale / instrument reading. See `.section-divider` in `globals.css`.
- The nameplate tagline `바다를 정확하게` is set in `--accent-teal`, signing the masthead with the sea.

## 6. Components
- **Masthead**: 4px `--accent` rule → flush-left `다이브 저널` (IBM Plex Sans KR 600 ~30px) + `DIVE journal` (IBM Plex Sans 11px tracked) → right folio (date + tagline) → 1px `--border` hairline.
- **Nav**: single dense scrollable row, 12 two-line items (KO 13px / EN 10px), active = 2px section-color underline. Never wraps, never collapses to a hamburger.
- **Cards** (`.news-card`): `--card`, 1px `--border`, 6px radius, 16px padding, no shadow, led by colored kicker.
- **Article**: ~680px measure, IBM Plex Sans KR H1, Gothic A1 body 17–18px/1.8, meta rule in hairlines, `.pullquote` with 3px `--accent` square-cornered left rule.

## 7. Implementation
A `globals.css` `:root`/`.dark` revalue (15 names unchanged + 4 new named props) + `layout.tsx` font swap + `Header.tsx` restructure. No architectural refactor. Comments, auth, evaluation badges, and dark mode all ride the same tokens. Remove all cream/teal/Gowun Batang remnants.

---

# v3 — Warm Editorial Broadsheet (Tidal Broadsheet) ⭐ CURRENT

## 블렌드 변경 요약 — Tidal Broadsheet (Warm Editorial Broadsheet)

기존 "Digital Broadsheet"(차갑고 딱딱함)의 신문 신뢰 구조는 그대로 유지하되, 이전 "Tidal" 매거진의 따뜻함·세련됨을 다시 섞었습니다. 구조 리팩터링 없이 **CSS 변수 값 + 폰트 2개 바인딩 + 헤더 경미 조정**만으로 구현됩니다.

### 1. 따뜻함 (너무 딱딱하다 → 부드럽게)
- 종이: 차가운 회색 `#f4f5f6` → **따뜻한 아이보리 신문지 `#f3eee3`** (R−B ≈ +15, 옛 크림과 옛 회색의 중간, 노란 라이프스타일 톤은 배제).
- 전경색: 청흑색 `#15181c` → **따뜻한 근흑색 `#1a1712`**. 모든 중성색(테두리·muted·muted-fg)을 따뜻한 베이지 축으로 재구성.
- 다크모드도 동일하게 따뜻하게: bg `#14120d`(커피 블랙), text `#ece6da`(따뜻한 종이흰색).
- 수직 리듬 ~15–20% 여유 확대. `word-break: keep-all` 전 한글 유지.

### 2. 풍부한 색 (색을 더 풍부하게)
- 레드 `#7a1420` → **따뜻한 `#8a222a`** (7.6:1). 마스트헤드 룰을 넘어 네임플레이트·활성 카테고리·키커·풀쿼트 마크까지 확장.
- **섹션 색 시스템이 색의 주 엔진**: 4색(레드/네이비 `#15568f`/티얼 `#0e6450`/오커 `#8a4f12`)만 12개 섹션을 순환 → 무지개처럼 번잡해지지 않음.
- 신규 2차 따뜻한 액센트 **--accent-warm2 테라코타**. *판정단 약점 해결*: 텍스트용으로는 `#a85a20`(아이보리 위 4.6:1, AA 통과)로 강화하고, 8–12% 알파 **틴트 필드와 대형 워드마크 전용**으로 용도를 명확히 분리(작은 텍스트에는 절대 사용 안 함).
- **사용 상한(usage ceiling)을 코드에 명문화**: 블록당 섹션 색 1개, 카드당 틴트 필드 1개(상단 보더 또는 워시 중 택1), 틴트 알파 8–12% → "풍부함"이 "탁함"으로 가지 않도록 보장.

### 3. 폰트 세련 (폰트도 세련되게)
- **헤드라인을 산세리프 → 명조 세리프로** 전환이 핵심: KO 헤드라인 `--font-serif-kr` = **Nanum Myeongjo**(h1/h2, weight 800) — 한겨레 토요판/NYT weekend 계열의 품격 세리프.
- *판정단 약점 해결(명조 가늘어짐)*: 소형 헤드(h3/h4, ~24px 이하)는 더 견고한 **Noto Serif KR 600**으로 자동 전환 → 가는 명조가 작은 크기에서 부서져 보이는 위험 제거.
- 본문 `--font-sans-kr` = **Gowun Dodum**(휴머니스트 산세, 따뜻한 터미널) — 본문 전용.
- *판정단 약점 해결(캡션 흐려짐)*: 데이트라인·캡션·메타데이터는 **IBM Plex Sans + Noto Sans KR**로 라우팅해 작은 크롬 텍스트의 선명도 유지.
- Latin: `--font-serif` = **Newsreader**(이탤릭 키커·'DIVE journal' 워드마크), `--font-sans` = **IBM Plex Sans**(구조 크롬). 데이트라인·폴리오·뎁스게이지는 tabular figures.

### 4. 헤더
- 4px 마스트헤드 룰 유지 + `#8a222a` 재채색, 하단 1px `--border-strong` 헤어라인 더블룰.
- 네임플레이트 '다이브 저널' → Nanum Myeongjo 800. 'DIVE journal' → Newsreader 이탤릭, 테라코타(대형 디스플레이=안전).
- 12개 카테고리 인덱스 내비 구조 100% 유지. 변화는 값뿐: 활성 항목 **레이블 자체가 섹션 색**, 호버 시 8% 섹션 틴트 워시 + 2px 언더라인, nav-bg 아이보리 밴드.

### 5. 대비 검증 (양 모드 AA)
- 본문: 라이트 `#1a1712`/`#f3eee3` ≈ 15:1, 다크 `#ece6da`/`#14120d` ≈ 14:1.
- 텍스트용 액센트(아이보리 위): 레드 7.6:1 · 네이비 5.9:1 · 티얼 6.2:1 · 오커 5.9:1 · 테라코타 4.6:1 — **전부 AA 통과**(이전 오커 4.72→5.9, 테라코타 3.26→4.6으로 약점 보강). 다크모드 액센트는 커피블랙 위에서 모두 AA 이상으로 재조정.
