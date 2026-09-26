import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getContest, listEntries, getSessionUser, contestPhase, publicUrl, type ContestEntry } from "@/lib/community";
import { phaseLabel, fmtDate, AWARD_LABEL } from "@/lib/contest-format";
import { EntryForm, VoteButton } from "@/components/community/ContestClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug, lang } = await params;
  const c = await getContest(slug);
  if (!c) return {};
  const cover = publicUrl("contest", c.cover_path);
  return { title: lang === "ko" ? c.title_ko : c.title_en || c.title_ko, description: c.theme_ko ?? undefined, openGraph: cover ? { images: [cover] } : undefined };
}

const AWARD_ORDER = ["grand", "gold", "silver", "bronze", "honorable"];

export default async function ContestPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: l, slug } = await params;
  const lang = l === "en" ? "en" : "ko";
  const ko = lang === "ko";
  const contest = await getContest(slug);
  if (!contest) notFound();
  const [entries, user] = await Promise.all([listEntries(contest.id), getSessionUser()]);
  const phase = contestPhase(contest);

  const approved = entries.filter((e) => e.status === "approved");
  const mine = user ? entries.filter((e) => e.user_id === user.id) : [];

  let myVote: string | null = null;
  if (user) {
    const supabase = await createClient();
    const { data } = await supabase.from("contest_votes").select("entry_id").eq("contest_id", contest.id).eq("user_id", user.id).maybeSingle();
    myVote = data?.entry_id ?? null;
  }

  // 득표수는 결과 공개 뒤에만 보여 준다(투표 중에 쏠림을 만들지 않도록)
  const votes = new Map<string, number>();
  if (contest.results_public) {
    const { data } = await createAdminClient().from("contest_votes").select("entry_id").eq("contest_id", contest.id);
    for (const v of data ?? []) votes.set(v.entry_id, (votes.get(v.entry_id) ?? 0) + 1);
  }
  const winners = contest.results_public
    ? approved.filter((e) => e.award).sort((a, b) => AWARD_ORDER.indexOf(a.award!) - AWARD_ORDER.indexOf(b.award!))
    : [];

  const cover = publicUrl("contest", contest.cover_path);
  const title = ko ? contest.title_ko : contest.title_en || contest.title_ko;
  const desc = ko ? contest.description_ko : contest.description_en || contest.description_ko;

  const voteDisabled = (e: ContestEntry) =>
    phase !== "voting" ? undefined
    : !user ? undefined
    : e.user_id === user.id ? (ko ? "내 응모작" : "Your entry")
    : undefined;

  return (
    <div>
      <section className="bleed abyss -mt-8">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover -z-10 opacity-35" />
        )}
        <div className="mag-container py-16 md:py-24 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 rise">
            <Link href={`/${lang}/contest`} className="text-sm muted hover:text-white">← {ko ? "콘테스트" : "Contests"}</Link>
            <div className="mt-6"><span className={`chip ${phase === "closed" ? "" : "chip-live"} !bg-white/10 !text-[var(--lagoon)]`}>{phaseLabel(contest, ko)}</span></div>
            <h1 className="font-headline !text-white text-[36px] md:text-[56px] leading-[1.05] mt-4">{title}</h1>
            {contest.theme_ko && <p className="text-xl mt-4 text-white/90 font-subheadline">{ko ? "주제" : "Theme"} · {contest.theme_ko}</p>}
            {desc && <p className="muted mt-6 leading-[1.9] whitespace-pre-line max-w-[640px]">{desc}</p>}
          </div>
          <div className="lg:col-span-5 rise rise-2">
            <dl className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 grid grid-cols-[88px_1fr] gap-y-3 text-sm">
              <dt className="muted">{ko ? "응모" : "Entries"}</dt><dd>{fmtDate(contest.submit_starts_at, ko, true)} ~ {fmtDate(contest.submit_ends_at, ko, true)}</dd>
              <dt className="muted">{ko ? "투표" : "Voting"}</dt><dd>~ {fmtDate(contest.vote_ends_at, ko, true)}</dd>
              <dt className="muted">{ko ? "응모 수" : "Limit"}</dt><dd>{ko ? `1인 ${contest.max_entries}점` : `${contest.max_entries} per person`}</dd>
              <dt className="muted">{ko ? "투표" : "Votes"}</dt><dd>{ko ? "회원 1인 1표(다시 고르면 표가 옮겨갑니다)" : "One per member (you can move it)"}</dd>
              {contest.prize_ko && (<><dt className="muted">{ko ? "시상" : "Prizes"}</dt><dd className="whitespace-pre-line">{contest.prize_ko}</dd></>)}
            </dl>

            {phase === "submitting" && (
              <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <h2 className="font-subheadline text-lg mb-4">{ko ? "응모하기" : "Enter"}</h2>
                {user ? (
                  <EntryForm slug={contest.slug} lang={lang} remaining={contest.max_entries - mine.length} />
                ) : (
                  <Link href={`/login?next=/${lang}/contest/${contest.slug}`} className="btn btn-lagoon">{ko ? "로그인하고 응모하기" : "Sign in to enter"}</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {winners.length > 0 && (
        <section className="mt-16">
          <div className="mag-section-head"><h2>{ko ? "수상작" : "Winners"}</h2></div>
          <div className="grid md:grid-cols-2 gap-10">
            {winners.map((e, i) => {
              const src = publicUrl("contest", e.image_path);
              const [aKo, aEn] = AWARD_LABEL[e.award!];
              return (
                <figure key={e.id} className={i === 0 ? "md:col-span-2" : ""}>
                  <div className="frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {src && <img src={src} alt={e.title} className="w-full h-auto" />}
                  </div>
                  <figcaption className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <span className="chip chip-gold">{ko ? aKo : aEn}</span>
                      <p className="font-subheadline text-xl mt-2">{e.title}</p>
                      <p className="text-muted-foreground text-sm">{e.author_name}{e.location ? ` · ${e.location}` : ""}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{ko ? `${votes.get(e.id) ?? 0}표` : `${votes.get(e.id) ?? 0} votes`}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {mine.some((e) => e.status !== "approved") && (
        <section className="mt-12 rounded-2xl border border-border p-5">
          <h2 className="font-subheadline mb-3">{ko ? "내 응모작 상태" : "Your entries"}</h2>
          <ul className="text-sm grid gap-1.5">
            {mine.map((e) => (
              <li key={e.id}>{e.title} · <span className="text-muted-foreground">{e.status === "pending" ? (ko ? "확인 중" : "In review") : e.status === "rejected" ? (ko ? "전시 제외" : "Not shown") : (ko ? "전시 중" : "Shown")}</span></li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <div className="mag-section-head">
          <h2>{ko ? "응모작" : "Entries"} <span className="text-muted-foreground text-lg font-normal">{approved.length}</span></h2>
          {phase === "voting" && !user && <Link href={`/login?next=/${lang}/contest/${contest.slug}`} className="more">{ko ? "로그인하고 투표하기 →" : "Sign in to vote →"}</Link>}
        </div>
        {approved.length === 0 ? (
          <p className="text-muted-foreground">{phase === "upcoming" ? (ko ? "응모가 시작되면 작품이 전시됩니다." : "Entries appear once the contest opens.") : ko ? "아직 전시된 응모작이 없습니다." : "No entries on display yet."}</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
            {approved.map((e) => {
              const src = publicUrl("contest", e.image_path);
              return (
                <figure key={e.id} className="break-inside-avoid mb-10 lift overflow-hidden">
                  <div className="media !rounded-b-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {src && <img src={src} alt={e.title} loading="lazy" className="w-full h-auto" />}
                  </div>
                  <figcaption className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-subheadline text-[17px] text-headline">{e.title}</p>
                        <p className="text-sm text-muted-foreground">{e.author_name}{e.location ? ` · ${e.location}` : ""}</p>
                      </div>
                      {contest.results_public && <span className="text-xs text-muted-foreground shrink-0">{votes.get(e.id) ?? 0}{ko ? "표" : ""}</span>}
                    </div>
                    {e.caption && <p className="text-sm mt-3 leading-relaxed text-muted-foreground line-clamp-4">{e.caption}</p>}
                    {phase === "voting" && user && (
                      <div className="mt-4">
                        <VoteButton slug={contest.slug} entryId={e.id} lang={lang} voted={myVote === e.id} disabledReason={voteDisabled(e)} />
                      </div>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
