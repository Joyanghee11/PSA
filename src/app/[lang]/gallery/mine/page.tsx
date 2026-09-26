import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser, listMyArtworks, publicUrl, formatKrw } from "@/lib/community";
import { MyArtworkActions, MarkReadButton } from "@/components/community/MyArtworkActions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "내 작품" };

type Inquiry = { id: string; artwork_id: string; sender_name: string; sender_contact: string; message: string; created_at: string; read_at: string | null; artworks: { title: string } | null };

export default async function MyWorksPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ submitted?: string }> }) {
  const { lang: l } = await params;
  const { submitted } = await searchParams;
  const lang = l === "en" ? "en" : "ko";
  const ko = lang === "ko";
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/${lang}/gallery/mine`);

  const works = await listMyArtworks(user.id);
  const supabase = await createClient();
  const { data } = works.length
    ? await supabase
        .from("artwork_inquiries")
        .select("id, artwork_id, sender_name, sender_contact, message, created_at, read_at, artworks(title)")
        .in("artwork_id", works.map((w) => w.id))
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: [] };
  const inquiries = (data as unknown as Inquiry[] | null) ?? [];
  const unread = inquiries.filter((i) => !i.read_at).length;

  const statusLabel: Record<string, [string, string]> = {
    pending: [ko ? "검토 중" : "In review", "chip"],
    approved: [ko ? "게시 중" : "Live", "chip chip-live"],
    rejected: [ko ? "반려" : "Declined", "chip chip-sold"],
    sold: [ko ? "판매 완료" : "Sold", "chip chip-gold"],
    hidden: [ko ? "숨김" : "Hidden", "chip"],
  };

  return (
    <div className="max-w-[980px] mx-auto">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="kicker">{ko ? "작가 스튜디오" : "Artist studio"}</span>
          <h1 className="font-headline text-[36px] md:text-[44px] mt-3">{ko ? "내 작품" : "My works"}</h1>
        </div>
        <Link href={`/${lang}/gallery/new`} className="btn btn-primary">{ko ? "새 작품 등록" : "Submit new work"}</Link>
      </div>

      {submitted && (
        <p className="mt-6 rounded-2xl p-4 text-sm bg-[color-mix(in_srgb,var(--accent-teal)_10%,transparent)]">
          {ko ? "등록했습니다. 편집부 확인 후 갤러리에 게시됩니다." : "Submitted. It will go live after review."}
        </p>
      )}

      <section className="mt-12">
        <h2 className="font-subheadline text-xl mb-5">
          {ko ? "받은 구매 문의" : "Inquiries"} {unread > 0 && <span className="chip chip-live ml-2">{ko ? `새 문의 ${unread}` : `${unread} new`}</span>}
        </h2>
        {inquiries.length === 0 ? (
          <p className="text-muted-foreground text-sm">{ko ? "아직 받은 문의가 없습니다." : "No inquiries yet."}</p>
        ) : (
          <ul className="grid gap-4">
            {inquiries.map((q) => (
              <li key={q.id} className={`lift p-5 ${q.read_at ? "opacity-75" : ""}`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm">
                    <span className="font-semibold text-headline">{q.sender_name}</span>
                    <span className="text-muted-foreground"> · {q.sender_contact}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString(ko ? "ko-KR" : "en-US")}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{ko ? "작품" : "Work"}: {q.artworks?.title}</p>
                <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line">{q.message}</p>
                {!q.read_at && <div className="mt-3"><MarkReadButton id={q.id} lang={lang} /></div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-subheadline text-xl mb-5">{ko ? "등록한 작품" : "Your works"}</h2>
        {works.length === 0 ? (
          <p className="text-muted-foreground text-sm">{ko ? "등록한 작품이 없습니다." : "Nothing yet."}</p>
        ) : (
          <ul className="grid gap-4">
            {works.map((w) => {
              const [label, cls] = statusLabel[w.status] ?? [w.status, "chip"];
              const cover = publicUrl("artworks", w.images[0]);
              return (
                <li key={w.id} className="lift p-4 flex gap-5 items-center flex-wrap sm:flex-nowrap">
                  <Link href={`/${lang}/gallery/${w.id}`} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {cover && <img src={cover} alt="" className="w-full h-full object-cover" />}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className={cls}>{label}</span></div>
                    <Link href={`/${lang}/gallery/${w.id}`} className="font-subheadline text-lg text-headline hover:text-accent block mt-1.5 truncate">{w.title}</Link>
                    <p className="text-sm text-muted-foreground">{formatKrw(w.price_krw, lang)}</p>
                    {w.status === "rejected" && w.reject_reason && <p className="text-sm text-danger mt-1">{ko ? "반려 사유" : "Reason"}: {w.reject_reason}</p>}
                  </div>
                  <MyArtworkActions id={w.id} status={w.status} approvedBefore={!!w.approved_at} lang={lang} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
