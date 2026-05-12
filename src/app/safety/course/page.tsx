import { redirect } from "next/navigation";
import { readSafetySession } from "@/lib/safety/session";
import { COURSE_CHAPTERS } from "@/lib/safety/courseContent";
import { CourseClient } from "./CourseClient";

export const dynamic = "force-dynamic";

export default async function CoursePage() {
  const session = await readSafetySession();
  if (!session) {
    redirect("/safety");
  }

  return (
    <CourseClient
      chapters={COURSE_CHAPTERS}
      session={{
        nameKo: session.nameKo,
        instructorNo: session.instructorNo,
        completedChapters: session.completedChapters,
        lastPage: session.lastPage,
        examPassed: session.examPassed,
      }}
    />
  );
}
