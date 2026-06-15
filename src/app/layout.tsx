import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Sans_KR,
  Gothic_A1,
  IBM_Plex_Sans,
  Source_Serif_4,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// Korean headline / display sans — confident digital-broadsheet voice.
// NOTE: mapped to the --font-serif-kr slot for backward compatibility with the
// existing headline CSS rules. The slot name says "serif" but now holds a SANS
// Korean face — intentional (see design/palette.md).
const plexKr = IBM_Plex_Sans_KR({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Korean body sans — high-legibility gothic for dense, scannable reporting
const gothicA1 = Gothic_A1({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

// Latin labels, datelines, bylines, numerals (tabular-nums for timestamps)
const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

// Latin editorial serif — pull quotes / English long-read display only
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
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
      className={`${sourceSerif.variable} ${plexSans.variable} ${plexKr.variable} ${gothicA1.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
