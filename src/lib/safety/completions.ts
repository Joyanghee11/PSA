// PSA_safety: persisted completion records.
//
// Storage: Vercel Blob, single JSON file at safety/completions.bin, encrypted
// with AES-256-GCM using a key derived from JWT_SECRET (Sha-256). The blob URL
// itself is unguessable but the contents include PII (name/email/phone), so
// encryption is a defense in depth in case the URL leaks.
//
// Concurrency note: read-modify-write on a single blob. Acceptable for the
// expected volume of safety education completions (low single digits per day).
import "server-only";
import crypto from "node:crypto";
import { put, list } from "@vercel/blob";

const BLOB_PREFIX = "safety/";
const BLOB_NAME = "safety/completions.bin";

export interface CompletionRecord {
  /** "제 YYYY-MM-NNNNNN호" — generated once at first issuance, stable across reissues. */
  certNo: string;
  instructorNo: string;
  nameKo: string;
  nameEn: string;
  email: string;
  dob: string;
  level: string;
  contactNo: string;
  /** Most recent passing exam score (0–100). */
  examScore: number;
  /** Number of exam attempts at the time the cert was first issued. */
  examAttempts: number;
  /** Course start time (from session.startedAt). */
  courseStartedAt: string;
  /** First time the cert was issued (immutable). */
  firstIssuedAt: string;
  /** Most recent reissue. */
  lastIssuedAt: string;
  /** How many times the cert has been downloaded. */
  reissueCount: number;
}

interface CompletionFile {
  schemaVersion: 1;
  updatedAt: string;
  records: CompletionRecord[];
}

// ---------- crypto ----------

function getEncryptionKey(): Buffer {
  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    throw new Error(
      "JWT_SECRET env var must be set to read/write completion records."
    );
  }
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(plain: string): Buffer {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // layout: [magic 4][iv 12][tag 16][ciphertext]
  return Buffer.concat([Buffer.from("PSA1", "ascii"), iv, tag, enc]);
}

function decrypt(blob: Buffer): string {
  if (blob.length < 32 || blob.subarray(0, 4).toString("ascii") !== "PSA1") {
    throw new Error("invalid completion blob: bad magic");
  }
  const iv = blob.subarray(4, 16);
  const tag = blob.subarray(16, 32);
  const data = blob.subarray(32);
  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

// ---------- IO ----------

function emptyFile(): CompletionFile {
  return { schemaVersion: 1, updatedAt: new Date().toISOString(), records: [] };
}

async function readAll(): Promise<CompletionFile> {
  try {
    // Find the existing blob (URL is unguessable so we look it up by prefix).
    const listing = await list({ prefix: BLOB_PREFIX });
    const blob = listing.blobs.find((b) => b.pathname === BLOB_NAME);
    if (!blob) return emptyFile();
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) {
      console.warn(
        `[completions] failed to fetch blob (${res.status}); returning empty`
      );
      return emptyFile();
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const json = decrypt(buf);
    return JSON.parse(json) as CompletionFile;
  } catch (e) {
    console.warn(
      `[completions] read failed (${(e as Error).message}); returning empty`
    );
    return emptyFile();
  }
}

async function writeAll(file: CompletionFile): Promise<void> {
  const ciphertext = encrypt(JSON.stringify(file));
  await put(BLOB_NAME, ciphertext, {
    access: "public", // URL is unguessable; contents are encrypted
    contentType: "application/octet-stream",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

// ---------- public API ----------

export async function findByInstructorNo(
  instructorNo: string
): Promise<CompletionRecord | null> {
  const file = await readAll();
  return file.records.find((r) => r.instructorNo === instructorNo) ?? null;
}

export async function listCompletions(): Promise<CompletionRecord[]> {
  const file = await readAll();
  return [...file.records].sort((a, b) =>
    b.firstIssuedAt.localeCompare(a.firstIssuedAt)
  );
}

export interface CompletionStats {
  totalIssued: number;
  totalReissues: number;
  byLevel: Record<string, number>;
  thisMonth: number;
  averageScore: number;
}

export async function getStats(): Promise<CompletionStats> {
  const records = await listCompletions();
  const now = new Date();
  const thisMonthPrefix = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const byLevel: Record<string, number> = {};
  let totalReissues = 0;
  let scoreSum = 0;
  let scoreCount = 0;
  for (const r of records) {
    const lvl = r.level || "(미지정)";
    byLevel[lvl] = (byLevel[lvl] ?? 0) + 1;
    totalReissues += Math.max(0, r.reissueCount - 1);
    if (Number.isFinite(r.examScore)) {
      scoreSum += r.examScore;
      scoreCount += 1;
    }
  }
  return {
    totalIssued: records.length,
    totalReissues,
    byLevel,
    thisMonth: records.filter((r) => r.firstIssuedAt.startsWith(thisMonthPrefix))
      .length,
    averageScore: scoreCount === 0 ? 0 : Math.round(scoreSum / scoreCount),
  };
}

/**
 * Look up an existing completion (by instructor) or create a new one. The
 * cert number is generated on first creation and stable thereafter.
 */
export interface UpsertInput {
  instructorNo: string;
  nameKo: string;
  nameEn: string;
  email: string;
  dob: string;
  level: string;
  contactNo: string;
  examScore: number;
  examAttempts: number;
  courseStartedAt: string;
}

export async function upsertCompletion(
  input: UpsertInput
): Promise<CompletionRecord> {
  const file = await readAll();
  const idx = file.records.findIndex(
    (r) => r.instructorNo === input.instructorNo
  );
  const now = new Date().toISOString();

  let rec: CompletionRecord;
  if (idx >= 0) {
    const existing = file.records[idx];
    rec = {
      ...existing,
      // refresh learner-supplied fields (Korean name may differ across attempts)
      nameKo: input.nameKo,
      contactNo: input.contactNo,
      examScore: Math.max(existing.examScore, input.examScore),
      examAttempts: input.examAttempts,
      lastIssuedAt: now,
      reissueCount: existing.reissueCount + 1,
    };
    file.records.splice(idx, 1);
  } else {
    rec = {
      certNo: buildCertNoForFirstIssue(),
      instructorNo: input.instructorNo,
      nameKo: input.nameKo,
      nameEn: input.nameEn,
      email: input.email,
      dob: input.dob,
      level: input.level,
      contactNo: input.contactNo,
      examScore: input.examScore,
      examAttempts: input.examAttempts,
      courseStartedAt: input.courseStartedAt,
      firstIssuedAt: now,
      lastIssuedAt: now,
      reissueCount: 1,
    };
  }
  file.records.unshift(rec);
  file.updatedAt = now;
  await writeAll(file);
  return rec;
}

function buildCertNoForFirstIssue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  // Random 6-digit suffix; collision odds at this volume are negligible.
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `제 ${y}-${m}-${rand}호`;
}
