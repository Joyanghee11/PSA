import type { Contest } from "@/lib/community";

export function contestPhaseOf(c: Pick<Contest, "submit_starts_at" | "submit_ends_at" | "vote_ends_at">, now = Date.now()) {
  if (now < Date.parse(c.submit_starts_at)) return "upcoming" as const;
  if (now < Date.parse(c.submit_ends_at)) return "submitting" as const;
  if (now < Date.parse(c.vote_ends_at)) return "voting" as const;
  return "closed" as const;
}

export function phaseLabel(c: Pick<Contest, "submit_starts_at" | "submit_ends_at" | "vote_ends_at">, ko: boolean) {
  const p = contestPhaseOf(c);
  return p === "upcoming" ? (ko ? "공개 예정" : "Coming soon")
    : p === "submitting" ? (ko ? "응모 중" : "Open for entries")
    : p === "voting" ? (ko ? "투표 중" : "Voting")
    : (ko ? "마감" : "Closed");
}

export function fmtDate(iso: string, ko: boolean, withTime = false) {
  return new Date(iso).toLocaleString(ko ? "ko-KR" : "en-US", {
    timeZone: "Asia/Seoul", month: "long", day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export const AWARD_LABEL: Record<string, [string, string]> = {
  grand: ["대상", "Grand Prize"],
  gold: ["금상", "Gold"],
  silver: ["은상", "Silver"],
  bronze: ["동상", "Bronze"],
  honorable: ["가작", "Honorable Mention"],
};
