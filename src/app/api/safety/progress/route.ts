import { NextResponse } from "next/server";
import { z } from "zod";
import {
  readSafetySession,
  writeSafetySession,
  REQUIRED_CHAPTERS,
} from "@/lib/safety/session";

const schema = z.object({
  lastPage: z.number().int().min(1).max(2000).optional(),
  completedChapter: z.string().min(1).max(40).optional(),
});

export async function POST(req: Request) {
  const session = await readSafetySession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid-input" }, { status: 400 });
  }

  if (typeof parsed.data.lastPage === "number") {
    session.lastPage = parsed.data.lastPage;
  }

  if (parsed.data.completedChapter) {
    const c = parsed.data.completedChapter;
    if (REQUIRED_CHAPTERS.includes(c) && !session.completedChapters.includes(c)) {
      session.completedChapters = [...session.completedChapters, c];
    }
  }

  await writeSafetySession(session);
  return NextResponse.json({
    ok: true,
    lastPage: session.lastPage,
    completedChapters: session.completedChapters,
  });
}
