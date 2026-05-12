# PSA_safety — Deployment Notes

The PSA Safety online education module (`/safety/*`) is part of this Next.js
application but has its own data lifecycle: PSA member records are
**personally-identifying information (PII)** and must never be committed to
the repository or exposed publicly.

## Required environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | **Yes** | Signs the `psa-safety-token` session cookie. Must be a strong random string (32+ bytes). Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`. |
| `SAFETY_MEMBERS_B64` | **Yes** | Base64 string of gzipped `safety-members.json`. See encoding instructions below. |

Set both in the **Vercel project settings → Environment Variables** for *both*
Production and Preview environments before the first deployment that needs to
serve `/safety/*`.

## Encoding the members payload

The PSA member list (`src/data/safety-members.json`) is **gitignored**. To
publish a new copy to Vercel:

```bash
# 1) Place the canonical members JSON locally (gitignored path)
#    src/data/safety-members.json

# 2) Encode (gzip + Base64). Output is ~28KB for ~700 members — well under
#    Vercel's per-value env-var limit.
node scripts/encode-safety-members.mjs

#    Or write to a file you can copy from:
node scripts/encode-safety-members.mjs --file safety-members.b64.txt
```

Paste the resulting Base64 string into Vercel as the value of
`SAFETY_MEMBERS_B64`. The runtime loader (`src/lib/safety/members.ts`) detects
the gzip magic bytes automatically and decompresses on first use.

> **Never** commit the encoded file. The Base64 still contains PII — it is just
> compressed/encoded, not encrypted.

## Local development

For dev, set `SAFETY_MEMBERS_B64` in `.env.local`, **or** keep the raw JSON at
`src/data/safety-members.json` (gitignored). The loader prefers the env var
when both are present.

```bash
# .env.local — example for local dev
JWT_SECRET=dev-only-secret-do-not-use-in-prod
# Optional — only if you do not have the file locally
# SAFETY_MEMBERS_B64=<gzipped-base64>
```

## Updating the members list

Whenever the PSA member roster changes:

1. Replace `src/data/safety-members.json` locally with the new export.
2. Run `node scripts/encode-safety-members.mjs > new.b64`.
3. Update the `SAFETY_MEMBERS_B64` value in Vercel.
4. Trigger a redeploy (any commit, or "Redeploy" from the Vercel UI).

The loader caches the decoded payload per Node process, so a redeploy is
required for changes to take effect.

## Operational notes

- **Cookie**: `psa-safety-token`, HttpOnly, 24h TTL. Cleared on logout.
- **Middleware** (`src/middleware.ts`) protects `/safety/course`,
  `/safety/exam`, and `/safety/certificate`.
- **Final exam** correct answers live in `src/lib/safety/exam.ts` behind a
  `import "server-only"` guard. Grading happens server-side; the client never
  receives `correctIndex` values.
- **Certificate PDF** is generated on demand via `pdf-lib` + Nanum fonts that
  ship in `src/lib/safety/fonts/`. Total cert size ≈ 1.85 MB.
