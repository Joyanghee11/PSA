import { NextResponse } from "next/server";
import { clearSafetySession } from "@/lib/safety/session";

export async function POST() {
  await clearSafetySession();
  return NextResponse.json({ ok: true });
}
