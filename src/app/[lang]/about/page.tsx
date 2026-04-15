import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { companyInfo } from "@/config/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "ko" ? "소개" : "About",
    description: companyInfo.about[lang as Lang],
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const reg = companyInfo.registration;
  const biz = companyInfo.business;
  const ppl = companyInfo.people;
  const contact = companyInfo.contact;
  const isKo = lang === "ko";

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-headline mb-8">
        {isKo ? "다이브저널 소개" : "About Dive Journal"}
      </h1>

      {/* About */}
      <section className="mb-10">
        <p className="text-[16px] leading-relaxed text-foreground/90">
          {companyInfo.about[lang as Lang]}
        </p>
      </section>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-xl font-subheadline mb-4 pb-2 border-b-2 border-border-strong">
          {isKo ? "발행 목적" : "Our Mission"}
        </h2>
        <ul className="space-y-3 text-[15px] leading-relaxed text-foreground/85">
          <li className="flex gap-2">
            <span className="text-accent font-bold">01</span>
            <span>
              {isKo
                ? "전 세계 프리다이빙 및 다이빙 뉴스를 신속하고 정확하게 한국어와 영어로 보도합니다."
                : "Deliver worldwide freediving and diving news quickly and accurately in Korean and English."}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">02</span>
            <span>
              {isKo
                ? "AI 기술을 활용하여 24시간 글로벌 뉴스를 모니터링하고 기사를 생성합니다."
                : "Leverage AI technology to monitor global news 24/7 and generate articles."}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">03</span>
            <span>
              {isKo
                ? "프리다이빙 안전 문화 확산과 해양 환경 보전에 기여합니다."
                : "Contribute to spreading freediving safety culture and marine environmental conservation."}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">04</span>
            <span>
              {isKo
                ? "국내외 프리다이빙 커뮤니티의 소통과 발전을 지원합니다."
                : "Support communication and development of domestic and international freediving communities."}
            </span>
          </li>
        </ul>
      </section>

      {/* Registration */}
      <section className="mb-10">
        <h2 className="text-xl font-subheadline mb-4 pb-2 border-b-2 border-border-strong">
          {isKo ? "신문 등록 정보" : "Registration Information"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium w-[140px]">
                  {isKo ? "등록기관" : "Authority"}
                </td>
                <td className="py-3">{reg.authority}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "등록번호" : "Reg. No."}
                </td>
                <td className="py-3">{reg.registrationNo}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "종별 / 간별" : "Type"}
                </td>
                <td className="py-3">{reg.type} / {reg.category}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "제호" : "Title"}
                </td>
                <td className="py-3">{reg.name}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "법인명" : "Corporation"}
                </td>
                <td className="py-3">{reg.corporation}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "등록일" : "Registered"}
                </td>
                <td className="py-3">{reg.registrationDate}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "발행인" : "Publisher"}
                </td>
                <td className="py-3">{ppl.publisher}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "편집인" : "Editor"}
                </td>
                <td className="py-3">{ppl.editor}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Business */}
      <section className="mb-10">
        <h2 className="text-xl font-subheadline mb-4 pb-2 border-b-2 border-border-strong">
          {isKo ? "사업자 정보" : "Business Information"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium w-[140px]">
                  {isKo ? "사업자등록번호" : "Business Reg. No."}
                </td>
                <td className="py-3">{biz.registrationNo}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "대표" : "CEO"}
                </td>
                <td className="py-3">{ppl.ceo}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 text-muted-foreground font-medium">
                  {isKo ? "소재지" : "Address"}
                </td>
                <td className="py-3">
                  {isKo ? biz.address : biz.addressEn}
                </td>
              </tr>
              {contact.email && (
                <tr className="border-b border-border">
                  <td className="py-3 pr-4 text-muted-foreground font-medium">
                    {isKo ? "이메일" : "Email"}
                  </td>
                  <td className="py-3">
                    <a href={`mailto:${contact.email}`} className="text-accent-blue hover:underline">
                      {contact.email}
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Copyright notice */}
      <section className="p-5 bg-muted rounded text-sm text-muted-foreground leading-relaxed">
        {isKo ? (
          <p>
            본 사이트에 게재된 모든 기사와 콘텐츠의 저작권은 다이브저널에 있습니다.
            무단 전재, 복사, 배포를 금지하며, 기사 이용 및 제휴에 대한 문의는
            이메일({contact.email})로 연락해 주시기 바랍니다.
            일부 기사는 AI 기술을 활용하여 생성되었으며, 편집진의 검토를 거쳐 발행됩니다.
          </p>
        ) : (
          <p>
            All articles and content on this site are copyrighted by Dive Journal.
            Unauthorized reproduction, copying, and distribution are prohibited.
            For inquiries regarding article use and partnerships, please contact us at {contact.email}.
            Some articles are generated using AI technology and are published after editorial review.
          </p>
        )}
      </section>
    </div>
  );
}
