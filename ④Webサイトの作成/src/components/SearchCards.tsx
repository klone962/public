/// 検索結果表示用コンポネート
"use client";

import React from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  rarity: string;
  category: string[];
  type: string[];
  color: string[];
  lv: string;
  grow_cost: string;
  cost: string;
  limit: string;
  power: string;
  variable1: string;
  variable2: string[];
  format: string[];
}

interface Props {
  products: Product[];
}

const ProductCards: React.FC<Props> = ({ products }) => {
  const renderValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      const filtered = value.filter((v) => v && v !== "-");
      return filtered.length > 0 ? filtered.join("、") : null;
    }
    return value && value !== "-" ? value : null;
  };

  const getVariableNames = (categories: string[]) => {
    let result = { variable1: "Variable 1", variable2: "Variable 2" };
    categories.forEach((category) => {
      switch (category) {
        case "ルリグ":
          result = { variable1: "チーム", variable2: "コイン" };
          break;
        case "アシストルリグ":
          result = { variable1: "チーム", variable2: "使用タイミング" };
          break;
        case "アーツ":
        case "ピース":
          result = { variable1: "限定条件", variable2: "使用タイミング" };
          break;
        case "クラフト":
        case "シグニ":
        case "スペル":
        case "レゾナ":
        case "キー":
        case "コイン":
          result = { variable1: "限定条件", variable2: "ガード" };
          break;
      }
    });
    return result;
  };

  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5">
        {products.map((product, index) => {
          const { variable1, variable2 } = getVariableNames(product.category);
          return (
            <div
              key={index}
              className="card card-bordered bg-base-100 shadow-xl m-2 cursor-pointer"
              // onClick={() => handleCardClick(product.id)}
            >
              <Link
                href={{
                  pathname: `/search/${product.id}`,
                }}
              >
                <div className="card-body">
                  <div className="card-title flex flex-wrap text-sm">
                    <div>{product.id}</div>
                    <div>{product.rarity}</div>
                  </div>
                  <div className="card-title flex flex-wrap">
                    <div>{product.name}</div>
                  </div>

                  <div className="border border-neutral-content"></div>
                  <div className="flex flex-wrap gap-2">
                    {renderValue(product.category) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`カテゴリ: ${renderValue(
                        product.category
                      )}`}</span>
                    )}
                    {renderValue(product.type) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`${variable1}: ${renderValue(
                        product.type
                      )}`}</span>
                    )}
                    {renderValue(product.color) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`色: ${renderValue(
                        product.color
                      )}`}</span>
                    )}
                    {renderValue(product.lv) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`レベル: ${product.lv}`}</span>
                    )}
                    {renderValue(product.grow_cost) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`グロウコスト: ${product.grow_cost}`}</span>
                    )}
                    {renderValue(product.cost) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`コスト: ${product.cost}`}</span>
                    )}
                    {renderValue(product.limit) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`リミット: ${product.limit}`}</span>
                    )}
                    {renderValue(product.power) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`パワー: ${product.power}`}</span>
                    )}
                    {renderValue(product.variable1) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`${variable1}: ${product.variable1}`}</span>
                    )}
                    {renderValue(product.variable2) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`${variable2}: ${renderValue(
                        product.variable2
                      )}`}</span>
                    )}
                    {renderValue(product.format) && (
                      <span className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-gray-500/10">{`フォーマット: ${renderValue(
                        product.format
                      )}`}</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ProductCards;
