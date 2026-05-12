import { NextResponse } from "next/server";
import { z } from "zod";
import {
  readSafetySession,
  writeSafetySession,
  isCourseComplete,
} from "@/lib/safety/session";
import {
  EXAM_QUESTION_COUNT,
  getPublicQuestions,
  gradeExam,
} from "@/lib/safety/exam";

export const runtime = "nodejs";

// GET → returns the public question list for the current attempt.
// We use the session's startedAt + attempt count as the shuffle seed so the
// same attempt sees stable order, but each retake gets a new permutation.
export async function GET() {
  const session = await readSafetySession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  if (!isCourseComplete(session)) {
    return NextResponse.json(
      { error: "course-incomplete" },
      { status: 403 }
    );
  }
  const seedRaw = (session.startedAt ?? "") + ":" + session.examAttempts;
  let seed = 0;
  for (let i = 0; i < seedRaw.length; i++) {
    seed = (seed * 31 + seedRaw.charCodeAt(i)) >>> 0;
  }
  const questions = getPublicQuestions(seed);
  return NextResponse.json({
    questions,
    total: EXAM_QUESTION_COUNT,
    attempts: session.examAttempts,
    previousScore: session.examLastScore,
    passed: session.examPassed,
  });
}

const submitSchema = z.object({
  answers: z
    .array(
      z.object({
        id: z.string().min(1).max(20),
        choiceIndex: z.number().int().min(0).max(10),
      })
    )
    .min(1)
    .max(EXAM_QUESTION_COUNT),
});

// POST → grade and persist result.
export async function POST(req: Request) {
  const session = await readSafetySession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  if (!isCourseComplete(session)) {
    return NextResponse.json(
      { error: "course-incomplete" },
      { status: 403 }
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid-input" }, { status: 400 });
  }
  const result = gradeExam(parsed.data);

  session.examAttempts = (session.examAttempts ?? 0) + 1;
  session.examLastScore = result.percent;
  if (result.passed) session.examPassed = true;
  await writeSafetySession(session);

  return NextResponse.json({
    correct: result.correct,
    total: result.total,
    percent: result.percent,
    passed: result.passed,
    attempts: session.examAttempts,
    perQuestion: result.perQuestion, // includes correctIndex per Q for review
  });
}
