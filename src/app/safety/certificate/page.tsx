import Link from "next/link";
import { redirect } from "next/navigation";
import {
  isCertificateEligible,
  isCourseComplete,
  readSafetySession,
} from "@/lib/safety/session";
import { CertificateActions } from "./CertificateActions";

export const dynamic = "force-dynamic";

export default async function CertificatePage() {
  const session = await readSafetySession();
  if (!session) {
    redirect("/safety");
  }

  const courseDone = isCourseComplete(session);
  const eligible = isCertificateEligible(session);

  if (!courseDone) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent-warm)]">
          이수증 발급 요건 미충족
        </p>
        <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-serif-kr)] text-headline mt-3">
          아직 학습이 완료되지 않았습니다
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          본문 학습 → 최종 시험(90점 이상) 순서로 이수증이 발급됩니다.
          <br />
          현재까지 이수한 단원: {session.completedChapters.length} / 3 (필수)
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link
            href="/safety/course"
            className="inline-block px-5 py-2.5 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
          >
            학습 이어가기
          </Link>
        </div>
      </div>
    );
  }

  if (!eligible) {
    // course done but exam not passed
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent-warm)]">
          최종 시험 합격이 필요합니다
        </p>
        <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-serif-kr)] text-headline mt-3">
          이수증 발급 전 시험 응시 필수
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          본문 학습은 모두 완료하셨습니다. 25문항의 최종 평가에 응시하여
          90점 이상 획득하시면 이수증이 발급됩니다.
          {session.examAttempts > 0 && (
            <>
              <br />
              <span className="text-foreground">
                직전 응시 결과: {session.examLastScore}점 (
                {session.examAttempts}회 응시) — 재응시 가능
              </span>
            </>
          )}
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link
            href="/safety/exam"
            className="inline-block px-5 py-2.5 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
          >
            📝 최종 시험 응시
          </Link>
          <Link
            href="/safety/course"
            className="inline-block px-5 py-2.5 rounded-md border border-border text-sm hover:bg-muted"
          >
            학습 다시 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">
          학습 + 시험 합격 ({session.examLastScore}점) 완료
        </p>
        <h1 className="font-[family-name:var(--font-serif-kr)] text-3xl sm:text-4xl text-headline mt-3 leading-tight">
          수중레저 안전교육
          <br />
          이수증
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          축하합니다, <strong className="text-foreground">{session.nameKo}</strong>{" "}
          ({session.nameEn}) 님.
          <br />
          PDF 이수증을 발급받아 보관 또는 인쇄하실 수 있습니다.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <Row label="성명" value={`${session.nameKo} (${session.nameEn})`} />
          <Row label="강사 번호" value={session.instructorNo} />
          <Row label="이메일" value={session.email} />
          <Row label="생년월일" value={session.dob} />
          <Row label="보유 자격" value={session.level || "—"} />
          <Row label="교육과정명" value="수중레저안전요원 안전교육" />
        </dl>

        <div className="mt-8 pt-6 border-t border-border">
          <CertificateActions />
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
        이수증은 발급 시 임의의 일련번호가 부여됩니다. 한 번 다운로드한 후
        보관해 주세요. 분실 시 재발급이 가능하나 새로운 일련번호가 발급됩니다.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
