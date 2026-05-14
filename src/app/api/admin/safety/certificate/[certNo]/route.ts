// Admin reissue endpoint — looks up an existing completion by cert number and
// returns the PDF. The cert number, issue date, and recipient details are
// pulled from the persisted record (not the requesting admin's session).
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listCompletions } from "@/lib/safety/completions";
import { buildCertificatePdf } from "@/lib/safety/certificate";
import type { SafetySessionPayload } from "@/lib/safety/types";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ certNo: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { certNo: encodedCertNo } = await ctx.params;
  const certNo = decodeURIComponent(encodedCertNo);

  const records = await listCompletions();
  const rec = records.find((r) => r.certNo === certNo);
  if (!rec) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  // Build a synthetic session payload sufficient for the cert renderer.
  const session: SafetySessionPayload = {
    instructorNo: rec.instructorNo,
    nameKo: rec.nameKo,
    nameEn: rec.nameEn,
    email: rec.email,
    dob: rec.dob,
    level: rec.level,
    completedChapters: ["ch1", "ch4", "addendum"],
    lastPage: 1,
    startedAt: rec.courseStartedAt || rec.firstIssuedAt,
    examPassed: true,
    examAttempts: rec.examAttempts,
    examLastScore: rec.examScore,
  };

  const pdf = await buildCertificatePdf({
    session,
    certNo: rec.certNo,
    issueDate: new Date(rec.firstIssuedAt),
    validityYears: 2,
  });

  const filenameKr = `PSA_안전교육_이수증_${rec.nameKo}_${rec.certNo}.pdf`;
  const asciiName = `PSA_safety_cert_${rec.instructorNo}_${rec.certNo.replace(/[^A-Za-z0-9-]/g, "")}.pdf`;
  const encoded = encodeURIComponent(filenameKr);

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encoded}`,
      "Cache-Control": "no-store",
    },
  });
}
