import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/community";
import { ArtworkForm } from "@/components/community/ArtworkForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "작품 등록" };

export default async function NewArtworkPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = l === "en" ? "en" : "ko";
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/${lang}/gallery/new`);
  const ko = lang === "ko";

  return (
    <div className="max-w-[820px] mx-auto">
      <span className="kicker">{ko ? "작가 전용" : "For artists"}</span>
      <h1 className="font-headline text-[36px] md:text-[48px] mt-3">{ko ? "작품 등록" : "Submit a work"}</h1>
      <p className="text-muted-foreground mt-3 mb-12 leading-relaxed">
        {ko ? "갤러리에서 제공하는 작품 정보처럼 크기, 재료, 에디션을 자세히 적을수록 구매 문의가 구체적으로 들어옵니다." : "The more you tell (size, medium, edition), the better the inquiries."}
      </p>
      <ArtworkForm lang={lang} defaultArtist={(user.user_metadata?.display_name as string | undefined) ?? undefined} />
    </div>
  );
}
