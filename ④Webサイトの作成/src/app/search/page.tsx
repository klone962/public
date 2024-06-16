// pages/index.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import useSWR from "swr";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

//コンポネート
import SearchCards from "../../components/SearchCards";
import Breadcrumbs from "../../components/Breadcrumbs";
import SidebarComponent from "../../components/DetailedConditions";
import Pagination from "../../components/Pagination";

//ts
import { generateBreadcrumbs } from "../../scripts/GenerateBreadcrumbs";
import { initialCategories, Category } from "../../data/categories";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </main>
  );
}

async function HomeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  // ページネーション用
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 30; // 1ページあたりのアイテム数

  const query = new URLSearchParams(params);
  const { data, error } = useSWR(params ? `/api?${query}` : null, fetcher, {});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    const newparams = new URLSearchParams(params);
    newparams.set("page", page.toString());
    newparams.set("limit", limit.toString());

    const newquery = newparams.toString();
    router.push(`/search?${newquery}`);
  };

  // 検索用
  const [input, setInput] = useState("");

  const handleSearch = () => {
    // パラメータ名ごとに値を集約して、カンマ区切りの文字列を生成
    const queryParams: Record<string, string[]> = categories.reduce(
      (params, category) => {
        const checkedItems = category.items
          .filter((item) => item.isChecked)
          .map((item) => encodeURIComponent(item.query));
        if (checkedItems.length > 0) {
          const existing = params[category.query] || [];
          params[category.query] = existing.concat(checkedItems);
        }
        return params;
      },
      {} as Record<string, string[]>
    );

    // クエリ文字列を組み立て
    let queryString = Object.keys(queryParams)
      .map((key) => `${encodeURIComponent(key)}=${queryParams[key].join(";")}`)
      .join("&");

    if (input.trim() !== "") {
      queryString = `keyword=${encodeURIComponent(input)}${
        queryString ? "&" + queryString : ""
      }`;
    }

    router.push(`/search${queryString ? "?" + queryString : ""}`);
  };

  // チェックボックスの管理
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  // チェックボックスの状態を更新する関数
  const handleCheckboxChange = (categoryId: number, itemId: number): void => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map((item) =>
              item.id === itemId
                ? { ...item, isChecked: !item.isChecked }
                : item
            ),
          };
        }
        return category;
      })
    );
  };

  // チェックボックスからすべてのチェックを外す関数
  const handleUncheckAll = (): void => {
    setCategories(
      categories.map((category) => ({
        ...category,
        items: category.items.map((item) => ({ ...item, isChecked: false })),
      }))
    );
  };

  // チェックボックスの状態をqueryから取得関数
  useEffect(() => {
    // URLパラメータから状態を設定
    // キーワードの設定
    const keyword = params.get("keyword");
    setInput(keyword || "");

    // チェックボックスの状態の設定
    const updatedCategories = categories.map((category) => ({
      ...category,
      items: category.items.map((item) => {
        // category.query に基づいてクエリパラメータの値を取得し、セミコロンで分割
        const paramValues = params.get(category.query)?.split(";") ?? [];
        return {
          ...item,
          // paramValues が item.name を含むかどうかで isChecked を設定
          isChecked: paramValues.includes(item.query),
        };
      }),
    }));
    setCategories(updatedCategories);
  }, []);

  // クエリキーとカテゴリ名のマッピングを作成
  const queryToCategoryName: Record<string, string> = categories.reduce(
    (acc, category) => {
      acc[category.query] = category.name;
      return acc;
    },
    {} as Record<string, string>
  );

  // 検索条件を表示する関数、角括弧で値を囲みます
  const displaySearchConditions = () => {
    return [...params.entries()]
      .filter(([key, _]) => key !== "page" && key !== "limit")
      .map(([key, value]) => {
        const categoryName = queryToCategoryName[key] || key; // マッピングにキーがない場合はキー自体を使用
        const formattedValues = value.split(";").join("・"); // セミコロンで区切られた値をカンマで結合
        return `${categoryName}-${formattedValues}`; // 値を角括弧で囲む
      })
      .join("  "); // 各条件をダブルスペースで区切る
  };

  // パンくずリスト
  const breadcrumbs = generateBreadcrumbs(pathname, query);

  return (
    <div>
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <div className="flex flex-wrap items-center justify-between">
            <div className="breadcrumbs ml-10">{Breadcrumbs(breadcrumbs)}</div>
            <div className="join">
              <div className="flex flex-wrap items-center mr-10 ml-10">
                <div>
                  <input
                    className="input input-sm join-item"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <label
                  htmlFor="my-drawer-4"
                  className="drawer-button btn btn-sm join-item base-content"
                >
                  絞り込み設定
                </label>
                <button className="btn btn-sm join-item" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>
          {data && !error ? (
            <>
              <div className="flex flex-wrap items-center ml-10 gap-4">
                <div>ヒット数: {data.totalItems} 件</div>
                <div
                  style={{
                    maxWidth: "90%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  検索条件: {displaySearchConditions()}
                </div>
              </div>
              <div className="border border-neutral m-2"></div>

              <div className="ml-10 mr-10">
                <SearchCards products={data.items} />
              </div>
              <div className="border border-neutral m-2"></div>
              <div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  limitPage={limit}
                  onNavigate={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-screen">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          {/* Sidebar content here */}
          <SidebarComponent
            categories={categories}
            handleCheckboxChange={handleCheckboxChange}
            handleUncheckAll={handleUncheckAll}
          />
        </div>
      </div>
    </div>
  );
}
