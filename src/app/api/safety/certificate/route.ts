import { NextResponse } from "next/server";
import {
  isCertificateEligible,
  isCourseComplete,
  readSafetySession,
} from "@/lib/safety/session";
import { buildCertificatePdf } from "@/lib/safety/certificate";
import { getMember } from "@/lib/safety/members";
import { upsertCompletion } from "@/lib/safety/completions";

export const runtime = "nodejs"; // pdf-lib + fontkit need Node APIs

export async function GET() {
  const session = await readSafetySession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  if (!isCourseComplete(session)) {
    return NextResponse.json({ error: "course-incomplete" }, { status: 403 });
  }

  if (!isCertificateEligible(session)) {
    return NextResponse.json({ error: "exam-not-passed" }, { status: 403 });
  }

  // Look up the canonical PSA roster row to copy contactNo into the persisted
  // completion record (so the admin view has the contact even if the JSON is
  // later rotated).
  const member = await getMember(session.instructorNo);
  const contactNo = member?.contactNo ?? "";

  // Upsert — first call creates the cert number; subsequent calls reuse it
  // and bump reissueCount.
  const record = await upsertCompletion({
    instructorNo: session.instructorNo,
    nameKo: session.nameKo,
    nameEn: session.nameEn,
    email: session.email,
    dob: session.dob,
    level: session.level,
    contactNo,
    examScore: session.examLastScore,
    examAttempts: session.examAttempts,
    courseStartedAt: session.startedAt,
  });

  // Use the FIRST-issue date so the cert text stays the same on reissue.
  const issueDate = new Date(record.firstIssuedAt);
  const pdf = await buildCertificatePdf({
    session: {
      ...session,
      // Use the persisted Korean name in case it was edited
      nameKo: record.nameKo,
    },
    certNo: record.certNo,
    issueDate,
    validityYears: 2,
  });

  const filenameKr = `PSA_안전교육_이수증_${record.nameKo}_${record.certNo}.pdf`;
  const asciiName = `PSA_safety_cert_${record.instructorNo}_${record.certNo.replace(/[^A-Za-z0-9-]/g, "")}.pdf`;
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
