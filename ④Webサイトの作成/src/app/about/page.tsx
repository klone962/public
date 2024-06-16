// pages/index.tsx
"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import { generateBreadcrumbs } from "../../scripts/GenerateBreadcrumbs";

export default function About() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        }
      >
        <AboutContent />
      </Suspense>
    </main>
  );
}

function AboutContent() {
  const params = useSearchParams();
  const pathname = usePathname();

  const query = new URLSearchParams(params);
  const breadcrumbs = generateBreadcrumbs(pathname, query);
  return (
    <>
      <div className="breadcrumbs ml-10">{Breadcrumbs(breadcrumbs)}</div>
      <div className="flex flex-row flex-wrap justify-center gap-2 py-4">
        <div className="card card-bordered bg-base-100 shadow-xl m-2 w-full">
          <div className="card-body">
            <h2 className="card-title">このサイトについて</h2>

            <ul className="list-inside space-y-2">
              <li>wixossのカードの価格検索を行えます。</li>
              <li>
                各種アフィリエイトプログラム参加中のため、記事にPRを含む場合があります。
              </li>
              <li>
                連絡はこちらまで →
                <Link href={`https://twitter.com/cardsearchapp`}>
                  <button className="btn btn-outline btn-sm">
                    Xアカウント/cardsearchapp
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
