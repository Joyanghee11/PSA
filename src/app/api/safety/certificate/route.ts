import { NextResponse } from "next/server";
import {
  isCertificateEligible,
  isCourseComplete,
  readSafetySession,
} from "@/lib/safety/session";
import {
  buildCertNo,
  buildCertificatePdf,
} from "@/lib/safety/certificate";

export const runtime = "nodejs"; // pdf-lib + fontkit need Node APIs

export async function GET() {
  const session = await readSafetySession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  if (!isCourseComplete(session)) {
    return NextResponse.json(
      { error: "course-incomplete" },
      { status: 403 }
    );
  }

  if (!isCertificateEligible(session)) {
    // Course done but exam not passed yet
    return NextResponse.json(
      { error: "exam-not-passed" },
      { status: 403 }
    );
  }

  const issueDate = new Date();
  const certNo = buildCertNo(issueDate);
  const pdf = await buildCertificatePdf({
    session,
    certNo,
    issueDate,
    validityYears: 2,
  });

  // Build a safe ASCII filename + RFC 5987 UTF-8 fallback for the Korean filename
  const filenameKr = `PSA_안전교육_이수증_${session.nameKo}_${certNo}.pdf`;
  const asciiName = `PSA_safety_cert_${session.instructorNo}_${certNo.replace(/[^A-Za-z0-9-]/g, "")}.pdf`;
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
