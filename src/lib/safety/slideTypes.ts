// PSA_safety: discriminated-union types for designed slides.
//
// One source of truth for slide content. Each slide is a typed object that
// the renderer in src/components/safety/slides switches on.

export type Slide =
  | CoverSlide
  | SectionIntroSlide
  | BulletsSlide
  | DefinitionSlide
  | CompareSlide
  | TableSlide
  | FlowSlide
  | GridSlide
  | TimelineSlide
  | StatsSlide
  | QuoteSlide
  | ChecklistSlide
  | LawListSlide
  | QuizCheckpointSlide;

interface SlideBase {
  id: string;
  eyebrow?: string;
}

export interface CoverSlide extends SlideBase {
  type: "cover";
  chapter: string; // e.g. "Chapter Ⅰ"
  title: string;
  titleEn?: string;
  subtitle?: string;
  accent?: "tide" | "coral" | "ink";
}

export interface SectionIntroSlide extends SlideBase {
  type: "sectionIntro";
  title: string;
  intro: string;
  sections: { number: string; title: string; pages?: string }[];
}

export interface BulletsSlide extends SlideBase {
  type: "bullets";
  title: string;
  intro?: string;
  bullets: { lead?: string; text: string }[];
  reference?: { kr: string; url: string };
}

export interface DefinitionSlide extends SlideBase {
  type: "definition";
  title: string;
  term: string;
  termEn?: string;
  definition: string;
  notes?: string[];
}

export interface CompareSlide extends SlideBase {
  type: "compare";
  title: string;
  intro?: string;
  left: { title: string; subtitle?: string; bullets: string[]; tone?: "tide" | "coral" | "neutral" };
  right: { title: string; subtitle?: string; bullets: string[]; tone?: "tide" | "coral" | "neutral" };
}

export type TableCell =
  | string
  | { value: string; emphasis?: boolean; tone?: "tide" | "coral" | "muted" };

export interface TableSlide extends SlideBase {
  type: "table";
  title: string;
  intro?: string;
  columns: string[];
  rows: TableCell[][];
  footnote?: string;
}

export interface FlowSlide extends SlideBase {
  type: "flow";
  title: string;
  intro?: string;
  steps: { label: string; actor?: string; detail?: string }[];
  footnote?: string;
}

export interface GridSlide extends SlideBase {
  type: "grid";
  title: string;
  intro?: string;
  cards: { glyph?: string; title: string; body: string; tone?: "tide" | "coral" | "neutral" }[];
  columns?: 2 | 3 | 4;
}

export interface TimelineSlide extends SlideBase {
  type: "timeline";
  title: string;
  intro?: string;
  events: { date: string; label: string; detail?: string }[];
}

export interface StatsSlide extends SlideBase {
  type: "stats";
  title: string;
  intro?: string;
  scaleLabel?: string;
  bars: { label: string; value: number; sub?: string }[];
  footnote?: string;
}

export interface QuoteSlide extends SlideBase {
  type: "quote";
  title: string;
  source: string;
  text: string;
  bullets?: string[];
}

export interface ChecklistSlide extends SlideBase {
  type: "checklist";
  title: string;
  intro?: string;
  items: string[];
  footnote?: string;
}

export interface LawListSlide extends SlideBase {
  type: "lawList";
  title: string;
  intro?: string;
  laws: { name: string; subject: string }[];
  reference?: { kr: string; url: string };
}

/**
 * Mid-course knowledge checkpoint. The learner cannot advance to the next
 * slide until every question has been attempted; correct/incorrect feedback
 * appears inline. Choice text is sent to the client (this is a learning aid,
 * not the final exam) but is also re-validated client-side for UX.
 */
export interface QuizCheckpointSlide extends SlideBase {
  type: "quizCheckpoint";
  title: string;
  intro?: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  q: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
}

export interface SafetyChapter {
  id: string;
  number: string; // e.g. "Ⅰ", "Ⅳ", or "부록"
  titleKr: string;
  titleEn: string;
  required: boolean;
  slides: Slide[];
}

export interface CourseModel {
  chapters: SafetyChapter[];
}
