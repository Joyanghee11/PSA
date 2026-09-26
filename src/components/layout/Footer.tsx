import Link from "next/link";
import type { Dictionary } from "@/config/i18n";
import type { Lang } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { companyInfo } from "@/config/company";
import { getCategoryLabel } from "@/lib/utils";

export function Footer({ dict, lang }: { dict: Dictionary; lang: Lang }) {
  const reg = companyInfo.registration;
  const biz = companyInfo.business;
  const ppl = companyInfo.people;
  const contact = companyInfo.contact;

  return (
    <footer className="abyss text-[#93a9b8] mt-auto">
      {/* Upper footer */}
      <div className="border-b border-white/10">
        <div className="mag-container py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand + About */}
            <div className="md:col-span-5">
              <Link href={`/${lang}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo-light-h120.png" alt="DIVE JOURNAL 다이브저널" width={215} height={120} className="h-[76px] w-auto" />
              </Link>
              <p className="text-sm leading-relaxed mt-3 text-[#aaa]">
                {companyInfo.about[lang]}
              </p>
              <Link
                href={`/${lang}/about`}
                className="inline-block mt-2 text-sm text-[#ccc] hover:text-white transition-colors"
              >
                {lang === "ko" ? "소개 더보기 >" : "Learn more >"}
              </Link>
            </div>

            {/* Sections */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-bold text-[#ccc] uppercase tracking-widest mb-3">
                {dict.nav.categories}
              </h4>
              <ul className="grid grid-cols-2 gap-1.5">
                {siteConfig.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/${lang}/category/${cat.slug}`}
                      className="text-sm text-[#999] hover:text-white transition-colors"
                    >
                      {getCategoryLabel(cat.slug as any, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-bold text-[#ccc] uppercase tracking-widest mb-3">
                {lang === "ko" ? "연락처" : "Contact"}
              </h4>
              <ul className="space-y-1.5 text-sm">
                {contact.email && (
                  <li>
                    <span className="text-[#777]">Email </span>
                    <a href={`mailto:${contact.email}`} className="text-[#aaa] hover:text-white">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <span className="text-[#777]">Tel </span>
                    <span className="text-[#aaa]">{contact.phone}</span>
                  </li>
                )}
                <li>
                  <span className="text-[#777]">
                    {lang === "ko" ? "주소 " : "Address "}
                  </span>
                  <span className="text-[#aaa]">
                    {lang === "ko" ? biz.address : biz.addressEn}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Registration info - Korean newspaper standard */}
      <div className="mag-container py-8">
        <div className="text-xs text-[#666] leading-relaxed space-y-1">
          <p>
            {lang === "ko" ? (
              <>
                <span className="text-[#888]">인터넷신문 등록번호</span> {reg.authority} {reg.registrationNo}
                {" | "}
                <span className="text-[#888]">등록일</span> {reg.registrationDate}
                {" | "}
                <span className="text-[#888]">제호</span> {reg.name}
              </>
            ) : (
              <>
                <span className="text-[#888]">Registration No.</span> {reg.authority} {reg.registrationNo}
                {" | "}
                <span className="text-[#888]">Registered</span> {reg.registrationDate}
              </>
            )}
          </p>
          <p>
            {lang === "ko" ? (
              <>
                <span className="text-[#888]">발행인·편집인</span> {ppl.publisher}
                {" | "}
                <span className="text-[#888]">사업자등록번호</span> {biz.registrationNo}
                {" | "}
                <span className="text-[#888]">법인명</span> {reg.corporation}
              </>
            ) : (
              <>
                <span className="text-[#888]">Publisher & Editor</span> {ppl.publisher}
                {" | "}
                <span className="text-[#888]">Business Reg. No.</span> {biz.registrationNo}
              </>
            )}
          </p>
          <p>
            {lang === "ko" ? (
              <>
                <span className="text-[#888]">소재지</span> {biz.address}
              </>
            ) : (
              <>
                <span className="text-[#888]">Address</span> {biz.addressEn}
              </>
            )}
          </p>
        </div>

        <div className="border-t border-white/10 mt-4 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#555]">
          <p>
            {lang === "ko"
              ? `Copyright © ${new Date().getFullYear()} 다이브저널. 모든 기사의 저작권은 다이브저널에 있으며 무단 전재, 복사, 배포를 금합니다.`
              : `Copyright © ${new Date().getFullYear()} Dive Journal. All rights reserved.`}
          </p>
          <p className="flex gap-4"><Link href={`/${lang}/gallery`} className="hover:text-white">{lang === "ko" ? "갤러리" : "Gallery"}</Link><Link href={`/${lang}/contest`} className="hover:text-white">{lang === "ko" ? "콘테스트" : "Contest"}</Link><Link href="/admin" className="hover:text-white">Admin</Link></p>
        </div>
      </div>
    </footer>
  );
}
