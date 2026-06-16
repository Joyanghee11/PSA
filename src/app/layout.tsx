import type { Metadata, Viewport } from "next";
import {
  Nanum_Myeongjo,
  Gowun_Dodum,
  IBM_Plex_Sans,
  Newsreader,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// Korean headline serif — Nanum Myeongjo (refined 명조). The elegant serif
// headline is the core "warm editorial broadsheet" move: it softens the rigid
// all-sans look and reads sophisticated. Mapped to the --font-serif-kr slot.
const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "800"],
});

// Korean body — Gowun Dodum (warm humanist sans). Keeps running text crisp and
// readable while carrying more warmth than a neutral gothic.
const gowunDodum = Gowun_Dodum({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

// Latin structural chrome — nav, datelines, folios, labels, tabular figures
const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Latin editorial serif — Newsreader, for the 'DIVE journal' wordmark, italic
// kickers, and English display. Refined, news-grade, with a magazine touch.
const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "다이브 저널 - Dive Journal",
    template: "%s | 다이브 저널",
  },
  description: "전 세계 프리다이빙 소식을 전하는 AI 인터넷 신문",
    verification: {
          google: "NUkGNP5ffmfBvIFziSJIKVtlPRFyHMrT8BL_M5NLL30",
          other: {
                  "naver-site-verification": "8518ec3b62017018364e9c6a826670e2b0c6a05d",
          },
    },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${newsreader.variable} ${plexSans.variable} ${nanumMyeongjo.variable} ${gowunDodum.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
