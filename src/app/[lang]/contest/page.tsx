import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedContests, contestPhase, publicUrl } from "@/lib/community";
import { phaseLabel, fmtDate } from "@/lib/contest-format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return lang === "ko" ? { title: "콘테스트", description: "다이브 저널 온라인 수중 사진 콘테스트" } : { title: "Contest", description: "Dive Journal online underwater photo contest" };
}

export default async function ContestsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = l === "en" ? "en" : "ko";
  const ko = lang === "ko";
  const contests = await listPublishedContests();
  const [current, ...past] = contests;

  return (
    <div>
      <section className="bleed abyss -mt-8 mb-14">
        <div className="mag-container py-16 md:py-24">
          <span className="kicker rise">{ko ? "Photo Contest" : "Photo Contest"}</span>
          <h1 className="font-headline !text-white text-[40px] md:text-[64px] leading-[1.02] mt-4 max-w-[900px] rise rise-2">
            {ko ? "한 장으로 말하는 바다" : "The sea, in a single frame"}
          </h1>
          <p className="muted mt-5 text-[17px] max-w-[620px] leading-relaxed rise rise-3">
            {ko ? "회차마다 주제를 정해 수중 사진을 받습니다. 응모가 끝나면 회원 투표가 열리고, 편집부 심사와 함께 수상작을 발표합니다. 회원은 콘테스트마다 한 표를 가집니다." : "Each round has a theme. After entries close, members vote (one vote per contest), and winners are announced with the editors' picks."}
          </p>

          {current && (
            <Link href={`/${lang}/contest/${current.slug}`} className="group mt-12 grid md:grid-cols-12 gap-0 rounded-[22px] overflow-hidden bg-white/5 ring-1 ring-white/10 hover:ring-white/30 transition-all shadow-[var(--shadow-3)] rise rise-4">
              <div className="md:col-span-7 aspect-[16/10] md:aspect-auto bg-black/30 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {current.cover_path && <img src={publicUrl("contest", current.cover_path)!} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />}
              </div>
              <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-center">
                <span className={`chip ${contestPhase(current) === "closed" ? "" : "chip-live"} self-start !bg-white/10 !text-[var(--lagoon)]`}>{phaseLabel(current, ko)}</span>
                <h2 className="font-headline text-[28px] md:text-[36px] mt-4">{ko ? current.title_ko : current.title_en || current.title_ko}</h2>
                {current.theme_ko && <p className="muted mt-3">{ko ? "주제" : "Theme"} · {current.theme_ko}</p>}
                <p className="muted text-sm mt-6">
                  {ko ? "응모" : "Entries"} {fmtDate(current.submit_starts_at, ko)} ~ {fmtDate(current.submit_ends_at, ko)} · {ko ? "투표" : "Voting"} ~ {fmtDate(current.vote_ends_at, ko)}
                </p>
                <span className="mt-8 text-[var(--lagoon)] font-semibold">{ko ? "자세히 보기 →" : "View contest →"}</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      {!current && (
        <div className="text-center py-16">
          <p className="font-headline text-2xl">{ko ? "첫 콘테스트를 준비하고 있습니다" : "The first contest is coming"}</p>
          <p className="text-muted-foreground mt-3">{ko ? "주제와 일정이 정해지면 이곳에 공개합니다." : "Theme and dates will be announced here."}</p>
        </div>
      )}

      {past.length > 0 && (
        <section>
          <div className="mag-section-head"><h2>{ko ? "지난 콘테스트" : "Past contests"}</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {past.map((c) => (
              <Link key={c.id} href={`/${lang}/contest/${c.slug}`} className="lift block">
                <div className="media aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.cover_path && <img src={publicUrl("contest", c.cover_path)!} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="p-5">
                  <span className="chip">{phaseLabel(c, ko)}</span>
                  <h3 className="font-subheadline text-lg mt-3">{ko ? c.title_ko : c.title_en || c.title_ko}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{fmtDate(c.submit_starts_at, ko)} ~ {fmtDate(c.vote_ends_at, ko)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
