import { notFound } from "next/navigation";
import { locales, getDictionary } from "@/config/i18n";
import type { Lang } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!locales.includes(lang as Lang)) {
    notFound();
  }

  const dict = getDictionary(lang as Lang);

  return (
    <>
      <Header lang={lang as Lang} dict={dict} />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
      <Footer dict={dict} />
    </>
  );
}
