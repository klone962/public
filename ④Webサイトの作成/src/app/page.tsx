// pages/index.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import SidebarComponent from "../components/DetailedConditions";
import { initialCategories, Category } from "../data/categories";

import TopVieCards from "../components/TopVieCards";
import { SearchTarget } from "../data/TopVieSeries";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
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

  // 検索用関数
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

  return (
    <div>
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <div className="flex flex-col min-h-50vh justify-center items-center space-y-12">
            <h1 className="text-5xl font-bold">ウィクロス価格検索</h1>
            <div className="join">
              <div className="flex flex-wrap justify-center items-center">
                <div>
                  <input
                    className="input join-item"
                    placeholder="カード名を入れてね"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <label
                  htmlFor="my-drawer-4"
                  className="drawer-button btn join-item base-content"
                >
                  絞り込み設定
                </label>
                <button className="btn join-item" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="m-4 space-y-4">
            <div className="divider divider-neutral">条件検索</div>
            <TopVieCards Boosters={SearchTarget} />
          </div>
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
