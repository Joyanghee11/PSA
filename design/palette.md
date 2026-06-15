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