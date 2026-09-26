import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { publicUrl, formatKrw, formatSize, type Artwork } from "@/lib/community";
import { ArtworkReview } from "@/components/community/AdminControls";

export const dynamic = "force-dynamic";

const ORDER = ["pending", "approved", "sold", "hidden", "rejected"];
const LABEL: Record<string, string> = { pending: "검토 대기", approved: "게시 중", sold: "판매 완료", hidden: "숨김", rejected: "반려" };

export default async function AdminGalleryPage() {
  const { data } = await createAdminClient().from("artworks").select("*").order("created_at", { ascending: false }).limit(500);
  const rows = (data as Artwork[] | null) ?? [];
  const { count: inquiries } = await createAdminClient().from("artwork_inquiries").select("id", { count: "exact", head: true });

  return (
    <div className="mag-container py-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground">← 관리자</Link>
          <h1 className="font-headline text-3xl mt-2">갤러리 작품 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">전체 {rows.length}점 · 누적 구매 문의 {inquiries ?? 0}건</p>
        </div>
        <Link href="/admin/contests" className="btn btn-ghost">콘테스트 관리 →</Link>
      </div>
      {ORDER.map((st) => {
        const list = rows.filter((r) => r.status === st);
        if (!list.length) return null;
        return (
          <section key={st} className="mt-10">
            <h2 className="font-subheadline text-xl mb-4">{LABEL[st]} <span className="text-muted-foreground text-base">{list.length}</span></h2>
            <ul className="grid gap-4">
              {list.map((a) => (
                <li key={a.id} className="lift p-4 grid md:grid-cols-[120px_1fr_auto] gap-5 items-start">
                  <div className="grid grid-cols-2 gap-1">
                    {a.images.slice(0, 4).map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={p} src={publicUrl("artworks", p)!} alt="" className="w-full aspect-square object-cover rounded" />
                    ))}
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="font-subheadline text-lg text-headline">{a.title} <span className="text-muted-foreground text-sm">· {a.artist_name}</span></p>
                    <p className="text-muted-foreground">{[a.medium, formatSize(a), a.edition, a.year].filter(Boolean).join(" · ")}</p>
                    <p className="mt-1">{formatKrw(a.price_krw, "ko")}{a.shipping ? ` · ${a.shipping}` : ""}</p>
                    {a.description && <p className="mt-2 text-muted-foreground line-clamp-3 whitespace-pre-line">{a.description}</p>}
                    {a.reject_reason && <p className="mt-2 text-danger">반려 사유: {a.reject_reason}</p>}
                    <p className="text-xs text-muted-foreground mt-2">등록 {new Date(a.created_at).toLocaleString("ko-KR")} · <Link href={`/ko/gallery/${a.id}`} className="underline">상세 보기</Link></p>
                  </div>
                  <ArtworkReview id={a.id} status={a.status} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {rows.length === 0 && <p className="mt-10 text-muted-foreground">등록된 작품이 없습니다.</p>}
    </div>
  );
}
