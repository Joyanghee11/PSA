// PSA_safety: JWT cookie-backed session.
// Used for /safety/course and /safety/certificate gating.
import "server-only";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { SafetySessionPayload } from "./types";

export const SAFETY_COOKIE = "psa-safety-token";
export const SAFETY_COOKIE_TTL_SECONDS = 60 * 60 * 24; // 24 h

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET || "psa-default-secret-change-me";
  return new TextEncoder().encode(s);
}

export async function signSafetySession(
  payload: SafetySessionPayload
): Promise<string> {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret());
}

export async function verifySafetyToken(
  token: string
): Promise<SafetySessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload !== "object" || payload === null) return null;
    if (typeof payload.instructorNo !== "string") return null;
    return payload as unknown as SafetySessionPayload;
  } catch {
    return null;
  }
}

export async function readSafetySession(): Promise<SafetySessionPayload | null> {
  const store = await cookies();
  const token = store.get(SAFETY_COOKIE)?.value;
  if (!token) return null;
  return verifySafetyToken(token);
}

export async function writeSafetySession(
  payload: SafetySessionPayload
): Promise<void> {
  const token = await signSafetySession(payload);
  const store = await cookies();
  store.set(SAFETY_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SAFETY_COOKIE_TTL_SECONDS,
    path: "/",
  });
}

export async function clearSafetySession(): Promise<void> {
  const store = await cookies();
  store.set(SAFETY_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Course-completion gate. The user must have visited the last slide in
 * every required chapter before they can take the final exam.
 *
 * The course covers TOC (informational) + 연안사고예방법 (ch1) + 수중형 (ch4)
 * + 2026 법령 부록 (addendum). The three study chapters are required.
 */
export const REQUIRED_CHAPTERS = ["ch1", "ch4", "addendum"];

export function isCourseComplete(s: SafetySessionPayload): boolean {
  const set = new Set(s.completedChapters ?? []);
  return REQUIRED_CHAPTERS.every((c) => set.has(c));
}

/**
 * Certificate eligibility — slides + final exam (≥ 90%) both required.
 */
export function isCertificateEligible(s: SafetySessionPayload): boolean {
  return isCourseComplete(s) && s.examPassed === true;
}
