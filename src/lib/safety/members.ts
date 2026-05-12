// PSA_safety: load member records and verify login attempts.
//
// Source priority (production-first):
//   1. SAFETY_MEMBERS_B64 env var — Base64-encoded JSON of the SafetyMembersFile
//   2. local file at src/data/safety-members.json (dev only — gitignored)
//
// PII NEVER lives in the repo. The encoding script is at
// scripts/encode-safety-members.mjs.
import "server-only";
import type {
  SafetyLoginInput,
  SafetyMemberRecord,
  SafetyMembersFile,
} from "./types";

let _cache: SafetyMembersFile | null = null;
let _loadingPromise: Promise<SafetyMembersFile> | null = null;

async function loadMembersFile(): Promise<SafetyMembersFile> {
  if (_cache) return _cache;
  if (_loadingPromise) return _loadingPromise;

  _loadingPromise = (async () => {
    // Production path — env var. Payload may be raw Base64 of JSON, OR
    // Base64 of gzip(JSON) — we auto-detect by sniffing the gzip magic
    // bytes (0x1f 0x8b) after decoding.
    const b64 = process.env.SAFETY_MEMBERS_B64;
    if (b64 && b64.trim().length > 0) {
      try {
        const buf = Buffer.from(b64, "base64");
        let json: string;
        if (buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
          const zlib = await import("node:zlib");
          json = zlib.gunzipSync(buf).toString("utf8");
        } else {
          json = buf.toString("utf8");
        }
        const file = JSON.parse(json) as SafetyMembersFile;
        if (!file.members || typeof file.members !== "object") {
          throw new Error("decoded payload missing .members object");
        }
        _cache = file;
        return file;
      } catch (e) {
        throw new Error(
          `SAFETY_MEMBERS_B64 is set but cannot be decoded/parsed: ${
            (e as Error).message
          }`
        );
      }
    }

    // Dev fallback — gitignored local file
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const fp = path.join(
      process.cwd(),
      "src",
      "data",
      "safety-members.json"
    );
    try {
      const txt = await readFile(fp, "utf8");
      const file = JSON.parse(txt) as SafetyMembersFile;
      _cache = file;
      return file;
    } catch (e) {
      throw new Error(
        "Safety member data not available. " +
          "Set SAFETY_MEMBERS_B64 environment variable in production, or " +
          "place the JSON at src/data/safety-members.json for local dev. " +
          `Underlying error: ${(e as Error).message}`
      );
    }
  })();

  return _loadingPromise;
}

function normEmail(s: string): string {
  return (s ?? "").trim().toLowerCase();
}

function normName(s: string): string {
  return (s ?? "").trim().toUpperCase().replace(/\s+/g, " ");
}

function normDob(s: string): string {
  const t = (s ?? "").trim().replace(/[./]/g, "-");
  const m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return t;
  const yyyy = m[1];
  const mm = m[2].padStart(2, "0");
  const dd = m[3].padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normInstr(s: string): string {
  return (s ?? "").trim();
}

export type VerifyResult =
  | { ok: true; member: SafetyMemberRecord }
  | { ok: false; reason: "not-found" | "mismatch" | "inactive" };

export async function verifyMember(
  input: SafetyLoginInput
): Promise<VerifyResult> {
  const file = await loadMembersFile();
  const instr = normInstr(input.instructorNo);
  const member = file.members[instr];
  if (!member) return { ok: false, reason: "not-found" };

  const emailOk = normEmail(input.email) === normEmail(member.email);
  const nameOk = normName(input.nameEn) === normName(member.nameEn);
  const dobOk = normDob(input.dob) === normDob(member.dob);

  if (!emailOk || !nameOk || !dobOk) {
    return { ok: false, reason: "mismatch" };
  }

  if (member.status && member.status.toLowerCase() !== "active") {
    return { ok: false, reason: "inactive" };
  }

  return { ok: true, member };
}

export async function getMember(
  instructorNo: string
): Promise<SafetyMemberRecord | null> {
  const file = await loadMembersFile();
  return file.members[normInstr(instructorNo)] ?? null;
}
