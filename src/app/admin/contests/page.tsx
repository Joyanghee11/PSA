import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { publicUrl, type Contest, type ContestEntry } from "@/lib/community";
import { phaseLabel, fmtDate, AWARD_LABEL } from "@/lib/contest-format";
import { ContestForm, EntryReview } from "@/components/community/AdminControls";

export const dynamic = "force-dynamic";

export default async function AdminContestsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const admin = createAdminClient();
  const [{ data: cs }, { data: es }, { data: vs }] = await Promise.all([
    admin.from("contests").select("*").order("submit_starts_at", { ascending: false }),
    admin.from("contest_entries").select("*").order("created_at", { ascending: false }).limit(2000),
    admin.from("contest_votes").select("entry_id").limit(100000),
  ]);
  const contests = (cs as Contest[] | null) ?? [];
  const entries = (es as ContestEntry[] | null) ?? [];
  const votes = new Map<string, number>();
  for (const v of vs ?? []) votes.set(v.entry_id, (votes.get(v.entry_id) ?? 0) + 1);
  const editing = contests.find((c) => c.id === edit);

  return (
    <div className="mag-container py-10">
      <Link href="/admin" className="text-sm text-muted-foreground">← 관리자</Link>
      <h1 className="font-headline text-3xl mt-2">콘테스트 관리</h1>

      <section className="lift p-6 mt-8">
        <h2 className="font-subheadline text-xl mb-5">{editing ? `수정: ${editing.title_ko}` : "새 콘테스트"}</h2>
        <ContestForm key={editing?.id ?? "new"} contest={editing} />
        {editing && <Link href="/admin/contests" className="text-sm text-muted-foreground mt-4 inline-block">새로 만들기로 돌아가기</Link>}
      </section>

      {contests.map((c) => {
        const list = entries.filter((e) => e.contest_id === c.id);
        const ranked = [...list].sort((a, b) => (votes.get(b.id) ?? 0) - (votes.get(a.id) ?? 0));
        return (
          <section key={c.id} className="mt-12">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-subheadline text-2xl">{c.title_ko}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {c.status === "published" ? "공개" : "비공개"} · {phaseLabel(c, true)} · 응모 {fmtDate(c.submit_starts_at, true)}~{fmtDate(c.submit_ends_at, true)} · 투표 ~{fmtDate(c.vote_ends_at, true)} · 응모 {list.length}건 · 결과 {c.results_public ? "공개" : "비공개"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/contests?edit=${c.id}`} className="btn btn-ghost !h-9">수정</Link>
                {c.status === "published" && <Link href={`/ko/contest/${c.slug}`} className="btn btn-ghost !h-9">보기</Link>}
              </div>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {ranked.map((e) => (
                <li key={e.id} className="lift overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={publicUrl("contest", e.image_path)!} alt="" className="w-full aspect-[4/3] object-cover" />
                  <div className="p-4 text-sm grid gap-2">
                    <div className="flex justify-between gap-2">
                      <p className="font-semibold text-headline truncate">{e.title}</p>
                      <span className="shrink-0">{votes.get(e.id) ?? 0}표</span>
                    </div>
                    <p className="text-muted-foreground">{e.author_name} · {e.status === "approved" ? "전시" : e.status === "pending" ? "대기" : "제외"}{e.award ? ` · ${AWARD_LABEL[e.award][0]}` : ""}</p>
                    <EntryReview id={e.id} status={e.status} award={e.award} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
