// PSA_safety: shared TypeScript types used across the safety course module.

export interface SafetyMemberRecord {
  instructorNo: string;
  nameEn: string;
  email: string;
  dob: string;
  level: string;
  status: string;
  center: string;
  /** Phone number from PSA roster (Korean format, may have hyphens stripped). */
  contactNo: string;
}

export interface SafetyMembersFile {
  generatedAt: string;
  count: number;
  skipped: number;
  members: Record<string, SafetyMemberRecord>;
}

export interface SafetyLoginInput {
  instructorNo: string;
  email: string;
  nameEn: string;
  nameKo: string;
  dob: string;
}

export interface SafetySessionPayload extends Record<string, unknown> {
  instructorNo: string;
  nameKo: string;
  nameEn: string;
  email: string;
  dob: string;
  level: string;
  completedChapters: string[];
  lastPage: number;
  startedAt: string;
  /** True when the learner has passed the final exam at least once. */
  examPassed: boolean;
  /** Number of times the exam has been attempted (pass or fail). */
  examAttempts: number;
  /** Most recent exam score (0–100). */
  examLastScore: number;
}

export interface SlideManifest {
  pageCount: number;
  chapters: SlideChapter[];
  pages: SlidePage[];
}

export interface SlideChapter {
  id: string;
  titleKr: string;
  titleEn: string;
  start: number;
  end: number;
  subsections?: SlideSubsection[];
}

export interface SlideSubsection {
  titleKr: string;
  page: number;
}

export interface SlidePage {
  n: number;
  w: number;
  h: number;
  file: string;
}
