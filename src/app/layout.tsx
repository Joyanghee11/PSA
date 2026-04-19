import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// Editorial serif for headlines and brand wordmark
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Clean sans for body and UI
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

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
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
