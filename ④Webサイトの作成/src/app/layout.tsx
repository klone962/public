import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import Link from "next/link";
import BaseHeader from "../components/BaseHeader";

const notosansjp = Noto_Sans_JP({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-notosansjp",
});

export const metadata: Metadata = {
  title: "ウィクロス価格検索",
  description: "ウィクロスの価格をまとめて検索できます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notosansjp.variable} font-notosansjp`}>
        <div className="flex flex-col min-h-screen">
          <header className="navbar bg-neutral text-neutral-content">
            <BaseHeader />
          </header>
          <div className="main-content pb-16">{children}</div>
          <footer className="footer mt-auto p-5 bg-neutral text-neutral-content">
            <Link href="/about">サイトについて</Link>
          </footer>
        </div>
      </body>
    </html>
  );
}
