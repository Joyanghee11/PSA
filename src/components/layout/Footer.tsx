import Link from "next/link";
import type { Dictionary } from "@/config/i18n";
import type { Lang } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { getCategoryLabel } from "@/lib/utils";

export function Footer({ dict, lang }: { dict: Dictionary; lang: Lang }) {
  return (
    <footer className="border-t-[3px] border-border-strong bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-headline mb-2">
              {lang === "ko" ? "다이브 저널" : "Dive Journal"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dict.siteTagline}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {dict.nav.categories}
            </h4>
            <ul className="grid grid-cols-2 gap-1.5">
              {siteConfig.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${lang}/category/${cat.slug}`}
                    className="text-sm text-foreground hover:text-accent transition-colors"
                  >
                    {getCategoryLabel(cat.slug as any, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Info
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lang === "ko"
                ? "다이브 저널은 AI 기술을 활용하여 전 세계 프리다이빙 뉴스를 수집하고, 한국어와 영어로 기사를 자동 생성하는 인터넷 신문입니다."
                : "Dive Journal is an AI-powered internet newspaper that collects worldwide freediving news and automatically generates articles in Korean and English."}
            </p>
          </div>
        </div>

        <hr className="divider my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>{dict.footer.copyright}</p>
          <p>{dict.footer.poweredBy}</p>
        </div>
      </div>
    </footer>
  );
}
