import { NextResponse } from "next/server";
import { readSafetySession, writeSafetySession } from "@/lib/safety/session";

// POST → clear examPassed so the learner can retake. Attempt count is kept
// (and incremented again on submit) so we can show "재시험 N회" if needed.
export async function POST() {
  const session = await readSafetySession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  session.examPassed = false;
  // Keep examLastScore so the user can see the previous score on the form.
  await writeSafetySession(session);
  return NextResponse.json({ ok: true });
}
