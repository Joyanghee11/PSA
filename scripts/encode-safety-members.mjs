#!/usr/bin/env node
// Encode src/data/safety-members.json to Base64 for the SAFETY_MEMBERS_B64
// Vercel environment variable.
//
// Usage:
//   node scripts/encode-safety-members.mjs            # prints to stdout
//   node scripts/encode-safety-members.mjs --file out.b64.txt
//
// SECURITY: never commit the output. The encoded blob still contains PII.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const src = path.join(repoRoot, "src", "data", "safety-members.json");

if (!fs.existsSync(src)) {
  console.error(`source not found: ${src}`);
  console.error(
    "Make sure the gitignored members JSON exists locally before encoding."
  );
  process.exit(1);
}

import zlib from "node:zlib";

const raw = fs.readFileSync(src, "utf8");
const parsed = JSON.parse(raw); // sanity check
const memberCount = Object.keys(parsed.members || {}).length;
// gzip first (deflate level 9), then Base64 — keeps Vercel env var under
// the per-value size limit. The loader gunzips automatically when it sees
// the gzip magic bytes (0x1f 0x8b) after Base64 decode.
const gz = zlib.gzipSync(Buffer.from(raw, "utf8"), { level: 9 });
const b64 = gz.toString("base64");
console.error(
  `[stats] raw=${raw.length}B  gzip=${gz.length}B  b64=${b64.length}B`
);

const args = process.argv.slice(2);
const fileFlagIdx = args.indexOf("--file");
if (fileFlagIdx >= 0 && args[fileFlagIdx + 1]) {
  const outPath = path.resolve(process.cwd(), args[fileFlagIdx + 1]);
  fs.writeFileSync(outPath, b64);
  console.error(
    `wrote ${b64.length} bytes (Base64) for ${memberCount} members to ${outPath}`
  );
} else {
  // Print just the Base64 to stdout so it can be piped/copied
  process.stdout.write(b64);
  console.error(
    `\n\n[ok] encoded ${memberCount} members → ${b64.length} bytes Base64`
  );
  console.error(
    "[next] paste the Base64 string above into Vercel as SAFETY_MEMBERS_B64."
  );
}
