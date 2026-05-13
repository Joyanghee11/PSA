// PSA_safety: renders a single designed slide based on its type tag.
//
// Visual system — Claude-style editorial design.
// Critical: every color used here is an explicit literal so the slide looks
// identical in light or dark mode (the surrounding site theme never bleeds in).
import { useEffect, useState } from "react";
import type {
  Slide,
  CoverSlide,
  SectionIntroSlide,
  BulletsSlide,
  DefinitionSlide,
  CompareSlide,
  TableSlide,
  TableCell,
  FlowSlide,
  GridSlide,
  TimelineSlide,
  StatsSlide,
  QuoteSlide,
  ChecklistSlide,
  LawListSlide,
  QuizCheckpointSlide,
} from "@/lib/safety/slideTypes";

// ---------- Design tokens (explicit hex, theme-independent) ----------
const C = {
  bg: "#FAF9F5",          // canvas — Claude cream
  card: "#FFFFFF",        // pure white card on canvas
  cardSoft: "#F4F1E8",    // softer warm card
  ink: "#0F1414",         // primary text — near-black w/ slight cool tint
  inkSoft: "#1F2A2C",     // body text
  muted: "#5C6463",       // captions/labels
  mutedSoft: "#8A8E8B",   // very soft hints
  border: "#E5E0D2",      // soft warm border
  borderHard: "#0F1414",  // hard divider for editorial accents
  accent: "#1F4448",      // tide — primary accent
  accentMid: "#2D5A60",
  accentSoft: "rgba(31,68,72,0.06)",
  accentBorder: "rgba(31,68,72,0.20)",
  warm: "#B85C52",        // coral — used very sparingly for emphasis
  warmSoft: "rgba(184,92,82,0.08)",
  warmBorder: "rgba(184,92,82,0.30)",
  highlight: "#FFF8E6",   // subtle yellow highlight
};

interface Props {
  slide: Slide;
  chapterTitle: string;
  slideIndex: number;
  totalInChapter: number;
  /** Called by quiz slides once the learner has graded their answers */
  onCheckpointPassed?: (slideId: string) => void;
  /** True if this quiz checkpoint was already passed earlier in the session */
  alreadyPassed?: boolean;
}

export function SlideRenderer({
  slide,
  chapterTitle,
  slideIndex,
  totalInChapter,
  onCheckpointPassed,
  alreadyPassed,
}: Props) {
  return (
    <div
      // colorScheme: light prevents the OS dark-mode auto-tint on form controls.
      style={{ colorScheme: "light", background: C.card, color: C.ink }}
      // Mobile: full-width with auto height (no fixed aspect, content-driven).
      //   The OUTER page scroll handles overflow — the slide itself does not
      //   clip, so users do not encounter a nested scroll trap.
      // sm+: editorial 16:10 frame with internal scroll.
      className="psa-slide w-full max-w-[1080px] sm:min-h-0 sm:aspect-[16/10] rounded-md sm:rounded-lg sm:overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(15,20,20,0.06)] sm:shadow-[0_2px_8px_rgba(15,20,20,0.08),0_24px_48px_-24px_rgba(15,20,20,0.18)]"
    >
      <header
        className="px-5 sm:px-10 lg:px-14 pt-4 sm:pt-6 pb-2.5 sm:pb-3 flex items-baseline justify-between gap-3"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-medium truncate"
          style={{ color: C.muted }}
        >
          {chapterTitle}
        </div>
        <div
          className="text-[10px] sm:text-[11px] tabular-nums shrink-0"
          style={{ color: C.muted }}
        >
          {slideIndex + 1} / {totalInChapter}
        </div>
      </header>
      <div
        className="flex-1 sm:overflow-auto px-5 sm:px-10 lg:px-14 py-5 sm:py-8"
        style={{ background: C.card, color: C.ink }}
      >
        {renderBody(slide, { onCheckpointPassed, alreadyPassed })}
      </div>
    </div>
  );
}

function renderBody(
  slide: Slide,
  ctx: {
    onCheckpointPassed?: (slideId: string) => void;
    alreadyPassed?: boolean;
  }
) {
  switch (slide.type) {
    case "cover":
      return <CoverBody slide={slide} />;
    case "sectionIntro":
      return <SectionIntroBody slide={slide} />;
    case "bullets":
      return <BulletsBody slide={slide} />;
    case "definition":
      return <DefinitionBody slide={slide} />;
    case "compare":
      return <CompareBody slide={slide} />;
    case "table":
      return <TableBody slide={slide} />;
    case "flow":
      return <FlowBody slide={slide} />;
    case "grid":
      return <GridBody slide={slide} />;
    case "timeline":
      return <TimelineBody slide={slide} />;
    case "stats":
      return <StatsBody slide={slide} />;
    case "quote":
      return <QuoteBody slide={slide} />;
    case "checklist":
      return <ChecklistBody slide={slide} />;
    case "lawList":
      return <LawListBody slide={slide} />;
    case "quizCheckpoint":
      return (
        <QuizCheckpointBody
          slide={slide}
          alreadyPassed={!!ctx.alreadyPassed}
          onPassed={() => ctx.onCheckpointPassed?.(slide.id)}
        />
      );
  }
}

// ---------- Shared building blocks ----------

function Eyebrow({ text, tone = "tide" }: { text?: string; tone?: "tide" | "coral" }) {
  if (!text) return null;
  return (
    <p
      className="text-[10.5px] uppercase tracking-[0.28em] font-semibold mb-3"
      style={{ color: tone === "coral" ? C.warm : C.accent }}
    >
      {text}
    </p>
  );
}

function Title({ children, size = "lg" }: { children: React.ReactNode; size?: "lg" | "xl" }) {
  return (
    <h2
      className={`font-[family-name:var(--font-serif-kr)] leading-[1.18] ${
        size === "xl"
          ? "text-[32px] sm:text-[44px] lg:text-[52px]"
          : "text-[22px] sm:text-[28px] lg:text-[34px]"
      }`}
      style={{ color: C.ink, letterSpacing: "-0.01em", wordBreak: "keep-all" }}
    >
      {children}
    </h2>
  );
}

function Intro({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p
      className="mt-3 sm:mt-4 text-[14px] sm:text-[15.5px] leading-[1.7] sm:leading-[1.75] max-w-[44em]"
      style={{ color: C.inkSoft, wordBreak: "keep-all" }}
    >
      {children}
    </p>
  );
}

function Footnote({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p
      className="mt-6 pt-4 text-[12px] leading-[1.7]"
      style={{ borderTop: `1px solid ${C.border}`, color: C.muted }}
    >
      {children}
    </p>
  );
}

function Reference({ kr, url }: { kr: string; url: string }) {
  return (
    <p
      className="mt-6 pt-4 text-[12px]"
      style={{ borderTop: `1px solid ${C.border}`, color: C.muted }}
    >
      <span className="font-medium" style={{ color: C.ink }}>
        참고 —{" "}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2"
        style={{ color: C.accent }}
      >
        {kr}
      </a>
    </p>
  );
}

// ---------- Slide bodies ----------

function CoverBody({ slide }: { slide: CoverSlide }) {
  const isCoral = slide.accent === "coral";
  return (
    <div className="h-full flex flex-col justify-center items-start py-2 relative">
      {/* large faded chapter mark in background — scales down on mobile */}
      <div
        aria-hidden
        className="absolute right-0 top-0 font-[family-name:var(--font-serif)] select-none pointer-events-none text-[120px] sm:text-[180px] lg:text-[240px]"
        style={{
          lineHeight: 1,
          color: isCoral ? C.warmSoft : C.accentSoft,
          fontWeight: 300,
        }}
      >
        {slide.chapter}
      </div>

      <div className="relative">
        <p
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.32em] font-bold"
          style={{ color: isCoral ? C.warm : C.accent }}
        >
          {slide.eyebrow}
        </p>
        <h1
          className="mt-5 sm:mt-8 font-[family-name:var(--font-serif-kr)] text-[34px] sm:text-[48px] lg:text-[68px] leading-[1.08] max-w-[16ch]"
          style={{ color: C.ink, letterSpacing: "-0.015em", wordBreak: "keep-all" }}
        >
          {slide.title}
        </h1>
        {slide.titleEn && (
          <p
            className="mt-3 sm:mt-4 italic font-[family-name:var(--font-serif)] text-[15px] sm:text-[18px] lg:text-[22px]"
            style={{ color: C.muted }}
          >
            {slide.titleEn}
          </p>
        )}
        {slide.subtitle && (
          <p
            className="mt-5 sm:mt-8 text-[14px] sm:text-[16px] leading-[1.7] max-w-[44em]"
            style={{ color: C.inkSoft, wordBreak: "keep-all" }}
          >
            {slide.subtitle}
          </p>
        )}
        <div
          className="mt-6 sm:mt-10 h-[2px] w-24 sm:w-32"
          style={{ background: isCoral ? C.warm : C.accent }}
        />
      </div>
    </div>
  );
}

function SectionIntroBody({ slide }: { slide: SectionIntroSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "섹션 안내"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <ol className="mt-8 grid sm:grid-cols-2 gap-3">
        {slide.sections.map((s, i) => (
          <li
            key={i}
            className="flex items-baseline gap-4 rounded-md px-4 py-3.5"
            style={{
              border: `1px solid ${C.border}`,
              background: C.cardSoft,
            }}
          >
            <span
              className="font-[family-name:var(--font-serif)] text-[26px] leading-none w-12 shrink-0 font-light"
              style={{ color: C.accent }}
            >
              {s.number}
            </span>
            <div>
              <p className="font-medium text-[14.5px]" style={{ color: C.ink }}>
                {s.title}
              </p>
              {s.pages && (
                <p className="text-[12px] mt-1" style={{ color: C.muted }}>
                  {s.pages}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BulletsBody({ slide }: { slide: BulletsSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <ul className="mt-6 space-y-2.5">
        {slide.bullets.map((b, i) => (
          <li
            key={i}
            className="flex gap-4 items-baseline rounded-md pl-4 pr-3 py-2.5"
            style={{
              borderLeft: `3px solid ${C.accent}`,
              background: C.accentSoft,
            }}
          >
            {b.lead && (
              <span
                className="text-[12px] font-bold uppercase tracking-wider shrink-0 w-14"
                style={{ color: C.accent }}
              >
                {b.lead}
              </span>
            )}
            <span
              className="text-[14.5px] leading-[1.7]"
              style={{ color: C.inkSoft, wordBreak: "keep-all" }}
            >
              {b.text}
            </span>
          </li>
        ))}
      </ul>
      {slide.reference ? (
        <Reference kr={slide.reference.kr} url={slide.reference.url} />
      ) : null}
    </div>
  );
}

function DefinitionBody({ slide }: { slide: DefinitionSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "용어 정의"} />
      <Title>{slide.title}</Title>
      <div
        className="mt-5 sm:mt-7 rounded-lg p-5 sm:p-7"
        style={{
          background: C.accentSoft,
          border: `1.5px solid ${C.accentBorder}`,
        }}
      >
        <div className="flex items-baseline gap-3 flex-wrap">
          <p
            className="font-[family-name:var(--font-serif-kr)] text-[24px] sm:text-[32px]"
            style={{ color: C.ink, letterSpacing: "-0.01em" }}
          >
            {slide.term}
          </p>
          {slide.termEn && (
            <p
              className="italic font-[family-name:var(--font-serif)] text-[13px] sm:text-[16px]"
              style={{ color: C.muted }}
            >
              {slide.termEn}
            </p>
          )}
        </div>
        <p
          className="mt-3 text-[14px] sm:text-[15.5px] leading-[1.7] sm:leading-[1.75]"
          style={{ color: C.inkSoft, wordBreak: "keep-all" }}
        >
          {slide.definition}
        </p>
      </div>
      {slide.notes && slide.notes.length > 0 && (
        <ul className="mt-6 space-y-2.5">
          {slide.notes.map((n, i) => (
            <li
              key={i}
              className="flex gap-3 text-[14px] leading-[1.7]"
              style={{ color: C.inkSoft, wordBreak: "keep-all" }}
            >
              <span className="shrink-0 mt-1" style={{ color: C.accent }}>
                ▸
              </span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CompareBody({ slide }: { slide: CompareSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "비교"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <div className="mt-6 grid sm:grid-cols-2 gap-4 flex-1">
        {[slide.left, slide.right].map((side, i) => {
          const tone = side.tone ?? "neutral";
          const accentColor =
            tone === "coral" ? C.warm : tone === "tide" ? C.accent : C.muted;
          const bg =
            tone === "coral"
              ? C.warmSoft
              : tone === "tide"
              ? C.accentSoft
              : C.cardSoft;
          return (
            <div
              key={i}
              className="rounded-md p-5 flex flex-col"
              style={{
                background: bg,
                borderLeft: `4px solid ${accentColor}`,
              }}
            >
              <p
                className="font-medium text-[17px]"
                style={{ color: C.ink }}
              >
                {side.title}
              </p>
              {side.subtitle && (
                <p className="text-[12px] mt-1" style={{ color: C.muted }}>
                  {side.subtitle}
                </p>
              )}
              <ul className="mt-4 space-y-2">
                {side.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="flex gap-2.5 text-[13.5px] leading-[1.65]"
                    style={{ color: C.inkSoft, wordBreak: "keep-all" }}
                  >
                    <span
                      className="shrink-0 mt-1.5 w-1 h-1 rounded-full"
                      style={{ background: accentColor }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TableBody({ slide }: { slide: TableSlide }) {
  function renderCell(cell: TableCell, key: string, isFirstCol: boolean) {
    const baseStyle = {
      color: C.inkSoft,
      borderBottom: `1px solid ${C.border}`,
    } as const;
    if (typeof cell === "string") {
      return (
        <td
          key={key}
          className="px-4 py-3 text-[13px] leading-[1.6] align-top"
          style={{
            ...baseStyle,
            color: isFirstCol ? C.ink : C.inkSoft,
            fontWeight: isFirstCol ? 500 : 400,
          }}
        >
          {cell}
        </td>
      );
    }
    const color =
      cell.tone === "tide"
        ? C.accent
        : cell.tone === "coral"
        ? C.warm
        : cell.tone === "muted"
        ? C.muted
        : C.inkSoft;
    return (
      <td
        key={key}
        className="px-4 py-3 text-[13px] leading-[1.6] align-top"
        style={{
          ...baseStyle,
          color,
          fontWeight: cell.emphasis ? 600 : 400,
        }}
      >
        {cell.value}
      </td>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "표"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <div
        className="mt-6 overflow-auto rounded-md"
        style={{ border: `1px solid ${C.border}` }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: C.cardSoft }}>
              {slide.columns.map((c, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-[11.5px] font-bold uppercase tracking-wider"
                  style={{
                    color: C.ink,
                    borderBottom: `2px solid ${C.borderHard}`,
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slide.rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? C.card : C.cardSoft }}>
                {row.map((cell, ci) =>
                  renderCell(cell, `${ri}-${ci}`, ci === 0)
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {slide.footnote ? <Footnote>{slide.footnote}</Footnote> : null}
    </div>
  );
}

function FlowBody({ slide }: { slide: FlowSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "절차"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <ol className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1 content-start">
        {slide.steps.map((s, i) => (
          <li
            key={i}
            className="relative rounded-lg p-4 flex flex-col"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              boxShadow: `0 1px 2px rgba(15,20,20,0.04)`,
            }}
          >
            <div className="flex items-baseline justify-between mb-2">
              <span
                className="font-[family-name:var(--font-serif)] text-[28px] leading-none font-light"
                style={{ color: C.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.actor && (
                <span
                  className="text-[10px] uppercase tracking-wider font-semibold"
                  style={{ color: C.muted }}
                >
                  {s.actor}
                </span>
              )}
            </div>
            <p className="font-medium text-[14px] mt-1" style={{ color: C.ink }}>
              {s.label}
            </p>
            {s.detail && (
              <p
                className="text-[12px] mt-2 leading-[1.6]"
                style={{ color: C.muted, wordBreak: "keep-all" }}
              >
                {s.detail}
              </p>
            )}
            {i < slide.steps.length - 1 && (
              <span
                aria-hidden
                className="hidden lg:block absolute top-1/2 -right-[14px] text-lg leading-none"
                style={{ color: C.accentBorder }}
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      {slide.footnote ? <Footnote>{slide.footnote}</Footnote> : null}
    </div>
  );
}

function GridBody({ slide }: { slide: GridSlide }) {
  const cols = slide.columns ?? 3;
  const colsClass =
    cols === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : cols === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "구성"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <div
        className={`mt-6 grid grid-cols-1 ${colsClass} gap-3 flex-1 content-start`}
      >
        {slide.cards.map((c, i) => {
          const tone = c.tone ?? "neutral";
          const isAccent = tone !== "neutral";
          const accentCol =
            tone === "coral" ? C.warm : tone === "tide" ? C.accent : C.border;
          return (
            <div
              key={i}
              className="rounded-lg p-5"
              style={{
                background: isAccent
                  ? tone === "coral"
                    ? C.warmSoft
                    : C.accentSoft
                  : C.card,
                border: `1px solid ${isAccent ? accentCol : C.border}`,
                boxShadow: `0 1px 2px rgba(15,20,20,0.04)`,
              }}
            >
              {c.glyph && (
                <div className="text-[24px] mb-2" aria-hidden>
                  {c.glyph}
                </div>
              )}
              <p
                className="font-semibold text-[14.5px]"
                style={{ color: C.ink }}
              >
                {c.title}
              </p>
              <p
                className="text-[12.5px] mt-2 leading-[1.65]"
                style={{ color: C.inkSoft, wordBreak: "keep-all" }}
              >
                {c.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineBody({ slide }: { slide: TimelineSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "연표"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <ol
        className="mt-8 relative pl-7"
        style={{ borderLeft: `2px solid ${C.accentBorder}` }}
      >
        {slide.events.map((e, i) => (
          <li key={i} className="relative pb-5">
            <span
              className="absolute -left-[34px] top-1 w-[14px] h-[14px] rounded-full"
              style={{ background: C.accent, boxShadow: `0 0 0 4px ${C.card}` }}
            />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-5">
              <p
                className="font-[family-name:var(--font-serif)] text-[14px] w-32 shrink-0 font-medium"
                style={{ color: C.accent }}
              >
                {e.date}
              </p>
              <div className="flex-1">
                <p className="font-medium text-[14.5px]" style={{ color: C.ink }}>
                  {e.label}
                </p>
                {e.detail && (
                  <p
                    className="text-[12.5px] mt-1 leading-[1.6]"
                    style={{ color: C.muted, wordBreak: "keep-all" }}
                  >
                    {e.detail}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StatsBody({ slide }: { slide: StatsSlide }) {
  const max = Math.max(...slide.bars.map((b) => b.value));
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "통계"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      {slide.scaleLabel && (
        <p
          className="text-[11.5px] uppercase tracking-wider font-semibold mt-5"
          style={{ color: C.muted }}
        >
          {slide.scaleLabel}
        </p>
      )}
      <div className="mt-3 space-y-3.5 flex-1 content-start">
        {slide.bars.map((b, i) => {
          const pct = max > 0 ? (b.value / max) * 100 : 0;
          return (
            <div key={i}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span
                  className="text-[13.5px] font-medium"
                  style={{ color: C.ink }}
                >
                  {b.label}
                </span>
                <span
                  className="text-[12px] tabular-nums"
                  style={{ color: C.muted }}
                >
                  <span
                    className="font-bold text-[13.5px]"
                    style={{ color: C.ink }}
                  >
                    {b.value.toLocaleString()}
                  </span>
                  {b.sub ? `  ·  ${b.sub}` : ""}
                </span>
              </div>
              <div
                className="h-3.5 rounded-full overflow-hidden"
                style={{ background: C.cardSoft }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accentMid} 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {slide.footnote ? <Footnote>{slide.footnote}</Footnote> : null}
    </div>
  );
}

function QuoteBody({ slide }: { slide: QuoteSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "조문"} />
      <Title>{slide.title}</Title>
      <blockquote
        className="mt-7 relative rounded-lg px-7 py-6"
        style={{
          background: C.accentSoft,
          borderLeft: `4px solid ${C.accent}`,
        }}
      >
        <span
          aria-hidden
          className="absolute -top-4 left-3 font-[family-name:var(--font-serif)] text-[64px] leading-none"
          style={{ color: C.accentBorder }}
        >
          &ldquo;
        </span>
        <p
          className="text-[15.5px] leading-[1.75] italic"
          style={{ color: C.ink, wordBreak: "keep-all" }}
        >
          {slide.text}
        </p>
        <cite
          className="block mt-4 text-[12px] not-italic font-medium"
          style={{ color: C.muted }}
        >
          — {slide.source}
        </cite>
      </blockquote>
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="mt-6 space-y-2.5">
          {slide.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-3 text-[14px] leading-[1.7]"
              style={{ color: C.inkSoft, wordBreak: "keep-all" }}
            >
              <span className="shrink-0 mt-1" style={{ color: C.accent }}>
                ▸
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChecklistBody({ slide }: { slide: ChecklistSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "체크리스트"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <ul className="mt-6 grid sm:grid-cols-2 gap-x-7 gap-y-2.5 flex-1 content-start">
        {slide.items.map((it, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span
              className="mt-[3px] inline-block w-[15px] h-[15px] rounded shrink-0"
              style={{
                border: `2px solid ${C.accent}`,
                background: C.card,
              }}
            />
            <span
              className="text-[13.5px] leading-[1.65]"
              style={{ color: C.inkSoft, wordBreak: "keep-all" }}
            >
              {it}
            </span>
          </li>
        ))}
      </ul>
      {slide.footnote ? <Footnote>{slide.footnote}</Footnote> : null}
    </div>
  );
}

function QuizCheckpointBody({
  slide,
  alreadyPassed,
  onPassed,
}: {
  slide: QuizCheckpointSlide;
  alreadyPassed: boolean;
  onPassed: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(alreadyPassed);

  // If user comes back to an already-passed quiz, immediately notify parent
  // so the Next button stays enabled.
  useEffect(() => {
    if (alreadyPassed) onPassed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyPassed]);

  const allAnswered = slide.questions.every((q) => answers[q.id] !== undefined);
  const correctCount = slide.questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;
  const allCorrect = correctCount === slide.questions.length;

  function handleCheck() {
    if (!allAnswered) return;
    setChecked(true);
    // Only mark this checkpoint passed when EVERY answer is correct.
    // Otherwise the learner must use 다시 풀기 and retry.
    if (correctCount === slide.questions.length) {
      onPassed();
    }
  }

  function handleRetry() {
    setAnswers({});
    setChecked(false);
  }

  return (
    <div className="h-full flex flex-col">
      <p
        className="text-[10.5px] uppercase tracking-[0.28em] font-semibold mb-3"
        style={{ color: C.warm }}
      >
        지식 복습 · CHECKPOINT
      </p>
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>

      <ol className="mt-6 space-y-4">
        {slide.questions.map((q, qi) => {
          const userPick = answers[q.id];
          const isCorrect = checked && userPick === q.correctIndex;
          const isWrong = checked && userPick !== undefined && !isCorrect;
          return (
            <li
              key={q.id}
              className="rounded-md p-4"
              style={{
                background: C.card,
                border: `1px solid ${
                  checked
                    ? isCorrect
                      ? C.accent
                      : C.warm
                    : C.border
                }`,
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="font-[family-name:var(--font-serif)] text-[20px] leading-none w-8 shrink-0 tabular-nums font-semibold"
                  style={{ color: C.accent }}
                >
                  Q{qi + 1}
                </span>
                <p
                  className="text-[14.5px] leading-[1.6]"
                  style={{ color: C.ink, wordBreak: "keep-all" }}
                >
                  {q.q}
                </p>
              </div>
              <ul className="ml-11 space-y-1">
                {q.choices.map((choice, ci) => {
                  const picked = userPick === ci;
                  const isCorrectChoice = ci === q.correctIndex;
                  let bg = "transparent";
                  let borderC = "transparent";
                  let textC = C.inkSoft;
                  if (checked) {
                    if (isCorrectChoice) {
                      bg = "rgba(31,68,72,0.08)";
                      borderC = C.accent;
                      textC = C.accent;
                    } else if (picked) {
                      bg = "rgba(184,92,82,0.06)";
                      borderC = C.warm;
                      textC = C.warm;
                    }
                  } else if (picked) {
                    bg = C.accentSoft;
                    borderC = C.accentBorder;
                    textC = C.ink;
                  }
                  return (
                    <li key={ci}>
                      <label
                        className="flex items-baseline gap-2 px-3 py-2 rounded cursor-pointer transition"
                        style={{
                          background: bg,
                          border: `1px solid ${borderC}`,
                        }}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={ci}
                          checked={picked}
                          disabled={checked}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [q.id]: ci }))
                          }
                          className="mt-0.5"
                          style={{ accentColor: C.accent }}
                        />
                        <span
                          className="text-[13.5px] leading-[1.55]"
                          style={{ color: textC, wordBreak: "keep-all" }}
                        >
                          {String.fromCharCode(0x2460 + ci)} {choice}
                          {checked && isCorrectChoice && (
                            <span className="ml-2 text-[11px] font-semibold">
                              ← 정답
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {checked && q.explanation && (
                <p
                  className="ml-11 mt-2 text-[12.5px] leading-[1.6] px-3 py-2 rounded"
                  style={{
                    background: isCorrect ? C.accentSoft : C.warmSoft,
                    color: C.inkSoft,
                  }}
                >
                  <span
                    className="font-medium"
                    style={{ color: isCorrect ? C.accent : C.warm }}
                  >
                    {isCorrect ? "✓ " : "✗ "}
                  </span>
                  {q.explanation}
                </p>
              )}
              {checked && isWrong && (
                <p
                  className="ml-11 mt-1 text-[12px] leading-relaxed"
                  style={{ color: C.warm }}
                >
                  ※ 이 문항은 오답입니다. 모든 문항을 정답으로 맞혀야 다음
                  슬라이드로 진행할 수 있습니다.
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-6 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        {!checked ? (
          <>
            <p className="text-[12.5px] leading-relaxed" style={{ color: C.muted }}>
              {allAnswered
                ? "모든 문항 응답 완료. 정답 확인 후 모든 문항을 맞춰야 다음 슬라이드로 진행됩니다."
                : `${
                    slide.questions.length -
                    Object.keys(answers).length
                  }개 문항이 응답되지 않았습니다.`}
            </p>
            <button
              type="button"
              onClick={handleCheck}
              disabled={!allAnswered}
              className="w-full sm:w-auto px-5 py-3 rounded-md text-[13px] font-semibold transition disabled:cursor-not-allowed shrink-0"
              style={{
                background: allAnswered ? C.accent : C.cardSoft,
                color: allAnswered ? C.card : C.mutedSoft,
                border: `1px solid ${allAnswered ? C.accent : C.border}`,
              }}
            >
              정답 확인
            </button>
          </>
        ) : allCorrect ? (
          <>
            <p
              className="text-[13.5px] font-medium leading-relaxed"
              style={{ color: C.accent }}
            >
              ✓ 전 문항 정답 ({correctCount}/{slide.questions.length}) — 다음
              슬라이드로 진행할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="w-full sm:w-auto px-4 py-2.5 rounded-md text-[12.5px] shrink-0"
              style={{
                background: "transparent",
                color: C.muted,
                border: `1px solid ${C.border}`,
              }}
            >
              다시 풀기
            </button>
          </>
        ) : (
          <>
            <p
              className="text-[13px] font-medium leading-relaxed"
              style={{ color: C.warm }}
            >
              ✗ {slide.questions.length - correctCount}문항 오답 ({correctCount}/
              {slide.questions.length} 정답) — 모두 맞혀야 다음으로 진행할 수
              있습니다. 정답을 검토하고 다시 풀어 주세요.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="w-full sm:w-auto px-5 py-3 rounded-md text-[13px] font-semibold shrink-0"
              style={{
                background: C.warm,
                color: "#FFFFFF",
                border: `1px solid ${C.warm}`,
              }}
            >
              다시 풀기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LawListBody({ slide }: { slide: LawListSlide }) {
  return (
    <div className="h-full flex flex-col">
      <Eyebrow text={slide.eyebrow ?? "관련 법률"} />
      <Title>{slide.title}</Title>
      <Intro>{slide.intro}</Intro>
      <ol className="mt-6 grid sm:grid-cols-2 gap-2.5 flex-1 content-start">
        {slide.laws.map((l, i) => (
          <li
            key={i}
            className="rounded-md px-4 py-3 flex items-baseline gap-3"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
            }}
          >
            <span
              className="font-[family-name:var(--font-serif)] text-[14px] w-7 shrink-0 tabular-nums font-semibold"
              style={{ color: C.accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-semibold text-[13.5px]" style={{ color: C.ink }}>
                {l.name}
              </p>
              <p
                className="text-[12px] mt-0.5 leading-[1.55]"
                style={{ color: C.muted, wordBreak: "keep-all" }}
              >
                {l.subject}
              </p>
            </div>
          </li>
        ))}
      </ol>
      {slide.reference ? (
        <Reference kr={slide.reference.kr} url={slide.reference.url} />
      ) : null}
    </div>
  );
}
