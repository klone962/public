"use client";

import React from "react";
import Link from "next/link";

// types/types.ts
interface StoreLinks {
  id: string;
  name: string;
}

interface YahooData {
  [key: string]: any; // 一時的な定義、具体的なプロパティに合わせて修正が必要
}

interface UrlList {
  bigweb: StoreLinks;
  yuyutei: StoreLinks;
  surugaya: StoreLinks;
  mercari: StoreLinks;
  yahoo: YahooData;
}

export default function LinkItems(urlData: UrlList) {
  if (!urlData) {
    return <span className="loading loading-dots loading-lg"></span>;
  }
  return (
    <div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-6">
        <div className="flex flex-col">
          <dt className="font-medium">カードIDで検索</dt>
          <div className="border-t border-gray-200 mt-2"></div>
          <div className="flex gap-4">
            <Link
              className="link link-accent mt-2"
              href={urlData.bigweb.id}
              rel="nofollow"
              target="_blank"
            >
              bigweb
            </Link>
            <Link
              className="link link-accent mt-2"
              href={urlData.yuyutei.id}
              rel="nofollow"
              target="_blank"
            >
              遊々亭
            </Link>
            <Link
              className="link link-accent mt-2"
              href={urlData.surugaya.id}
              rel="nofollow"
              target="_blank"
            >
              駿河屋
            </Link>
            <Link
              className="link link-accent mt-2"
              href={urlData.mercari.id}
              rel="nofollow"
              target="_blank"
            >
              メルカリ
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <dt className="font-medium">カード名で検索</dt>
          <div className="border-t border-gray-200 mt-2"></div>
          <div className="flex gap-4">
            <Link
              className="link link-accent mt-2"
              href={urlData.bigweb.name}
              rel="nofollow"
              target="_blank"
            >
              bigweb
            </Link>
            <Link
              className="link link-accent mt-2"
              href={urlData.yuyutei.name}
              rel="nofollow"
              target="_blank"
            >
              遊々亭
            </Link>
            <Link
              className="link link-accent mt-2"
              href={urlData.surugaya.name}
              rel="nofollow"
              target="_blank"
            >
              駿河屋
            </Link>
            <Link
              className="link link-accent mt-2"
              href={urlData.mercari.name}
              rel="nofollow"
              target="_blank"
            >
              メルカリ
            </Link>
          </div>
        </div>
        {/* <div className="flex flex-col">
          <dt className="font-medium">yahooショッピング</dt>
          <div className="border-t border-gray-200 mt-2"></div>
          {urlData.yahoo}
        </div> */}
      </dl>
    </div>
  );
}
