import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedContests, contestPhase, publicUrl } from "@/lib/community";
import { phaseLabel, fmtDate } from "@/lib/contest-format";
import { DeepHero } from "@/components/layout/DeepHero";

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
      <DeepHero
        image={publicUrl("contest", current?.cover_path)}
        kicker="Photo Contest · Dive Journal"
        displayTop="The sea,"
        displayEm="in one frame."
        name={current ? (ko ? current.title_ko : current.title_en || current.title_ko) : ko ? "한 장으로 말하는 바다" : "The sea, in a single frame"}
        lead={current?.theme_ko
          ? `${ko ? "이번 주제" : "Theme"} · ${current.theme_ko}. ${ko ? "응모가 끝나면 회원 투표가 열리고, 편집부 심사와 함께 수상작을 발표합니다." : "Members vote after entries close."}`
          : ko ? "회차마다 주제를 정해 수중 사진을 받습니다. 응모가 끝나면 회원 투표가 열리고, 편집부 심사와 함께 수상작을 발표합니다." : "A theme each round. Members vote after entries close, and winners are announced with the editors' picks."}
        primary={current ? { href: `/${lang}/contest/${current.slug}`, label: contestPhase(current) === "submitting" ? (ko ? "응모하기" : "Enter now") : contestPhase(current) === "voting" ? (ko ? "투표하기" : "Vote now") : (ko ? "자세히 보기" : "View contest") } : undefined}
        stats={current ? [
          { value: phaseLabel(current, ko), word: true, eyebrow: "Status", label: `${fmtDate(current.submit_starts_at, ko)} ~ ${fmtDate(current.vote_ends_at, ko)}` },
          { value: String(current.max_entries), unit: ko ? "점" : "", eyebrow: "Entries", label: ko ? "1인 응모 가능 수" : "per person" },
          { value: "1", unit: ko ? "표" : "", eyebrow: "Votes", label: ko ? "회원 1인 1표, 본인 작품 제외" : "one per member" },
        ] : [
          { value: ko ? "준비 중" : "Soon", word: true, eyebrow: "Next round", label: ko ? "주제와 일정을 곧 공개합니다" : "Theme and dates coming soon" },
        ]}
        scrollCue={false}
      />

      <div className="mt-16" />
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
