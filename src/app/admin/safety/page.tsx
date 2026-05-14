// /admin/safety — administrator overview of safety education completions.
// Protected by the existing admin token (psa-admin-token) via middleware.
import Link from "next/link";
import { listCompletions, getStats } from "@/lib/safety/completions";
import { AdminCompletionsTable } from "./AdminCompletionsTable";

export const dynamic = "force-dynamic";

export default async function AdminSafetyPage() {
  const [records, stats] = await Promise.all([listCompletions(), getStats()]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 text-foreground">
      <header className="mb-8 flex flex-wrap items-baseline gap-4 justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            PSA Admin · Safety Education
          </p>
          <h1 className="font-[family-name:var(--font-serif-kr)] text-3xl text-headline mt-2">
            안전교육 이수자 관리
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            본문 학습 + 최종 평가(90점 이상)를 통과해 이수증이 발급된 회원
            명단입니다.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Admin 홈
        </Link>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="총 이수자" value={stats.totalIssued} accent />
        <Stat label="이번 달 이수" value={stats.thisMonth} />
        <Stat label="평균 점수" value={`${stats.averageScore}점`} />
        <Stat label="총 재발급 횟수" value={stats.totalReissues} />
      </section>

      {Object.keys(stats.byLevel).length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
            자격 등급별 이수자
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byLevel)
              .sort(([, a], [, b]) => b - a)
              .map(([level, count]) => (
                <span
                  key={level}
                  className="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm"
                >
                  <span className="text-foreground">{level}</span>
                  <span className="text-accent font-medium tabular-nums">
                    {count}
                  </span>
                </span>
              ))}
          </div>
        </section>
      )}

      {/* Table */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
          이수자 명단 ({records.length}명)
        </h2>
        {records.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            아직 이수증이 발급된 회원이 없습니다.
          </div>
        ) : (
          <AdminCompletionsTable records={records} />
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-5 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-[family-name:var(--font-serif)] text-3xl tabular-nums ${
          accent ? "text-accent" : "text-headline"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
