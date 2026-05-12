import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyMember } from "@/lib/safety/members";
import { writeSafetySession } from "@/lib/safety/session";
import type { SafetySessionPayload } from "@/lib/safety/types";

const schema = z.object({
  instructorNo: z.string().trim().min(1).max(20),
  email: z.string().trim().email().max(120),
  nameEn: z.string().trim().min(1).max(80),
  nameKo: z.string().trim().min(1).max(40),
  dob: z.string().trim().min(8).max(12),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid-input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const result = await verifyMember(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 401 });
  }

  const session: SafetySessionPayload = {
    instructorNo: result.member.instructorNo,
    nameKo: parsed.data.nameKo.trim(),
    nameEn: result.member.nameEn,
    email: result.member.email,
    dob: result.member.dob,
    level: result.member.level,
    completedChapters: [],
    lastPage: 1,
    startedAt: new Date().toISOString(),
    examPassed: false,
    examAttempts: 0,
    examLastScore: 0,
  };

  await writeSafetySession(session);
  return NextResponse.json({ ok: true });
}
