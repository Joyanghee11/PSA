import { redirect } from "next/navigation";
import {
  isCourseComplete,
  readSafetySession,
} from "@/lib/safety/session";
import { ExamClient } from "./ExamClient";

export const dynamic = "force-dynamic";

export default async function ExamPage() {
  const session = await readSafetySession();
  if (!session) {
    redirect("/safety");
  }
  if (!isCourseComplete(session)) {
    redirect("/safety/course");
  }

  return (
    <ExamClient
      examPassed={session.examPassed}
      previousScore={session.examLastScore}
      attempts={session.examAttempts}
      learner={{ nameKo: session.nameKo, instructorNo: session.instructorNo }}
    />
  );
}
