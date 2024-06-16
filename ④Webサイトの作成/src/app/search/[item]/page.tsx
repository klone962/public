// pages/index.tsx
"use client";
import React from "react";
import useSWR from "swr";
import BackButton from "../../../components/BackButton";
import LinkItems from "../../../components/LinkItem";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const dynamic = "force-dynamic";

export default function ItemPage({ params }: { params: { item: string } }) {
  const {
    data: itemData,
    error: itemError,
    isValidating: isItemValidating,
  } = useSWR(params.item ? `/api/item?id=${params.item}` : null, fetcher, {});

  const apiUrl =
    itemData && itemData.length > 0
      ? `/api/url?id=${itemData[0].id}&name=${itemData[0].name}`
      : null;

  const {
    data: urlData,
    error: urlError,
    isValidating: isUrlValidating,
  } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
  });

  const getVariableNames = (category: string) => {
    switch (category) {
      case "ルリグ":
        return { variable1: "チーム", variable2: "コイン" };
      case "アシストルリグ":
        return { variable1: "チーム", variable2: "使用タイミング" };
      case "アーツ":
      case "ピース":
        return { variable1: "限定条件", variable2: "使用タイミング" };
      case "クラフト":
      case "シグニ":
      case "スペル":
      case "レゾナ":
      case "キー":
      case "コイン":
        return { variable1: "限定条件", variable2: "ガード" };
      default:
        return { variable1: "Variable 1", variable2: "Variable 2" };
    }
  };

  if (itemError)
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Failed to load data.</div>;
      </div>
    );

  if (!itemData && isItemValidating)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  const item = itemData[0];

  if (!item || !item.category) {
    // Handle the case where item is undefined or category is not provided
    return (
      <>
        <div className="flex flex-wrap items-center justify-between ml-10 m-5">
          <BackButton />
        </div>
        <div className="flex items-center justify-center h-screen">
          <div>Failed to load data.</div>;
        </div>
      </>
    );
  }

  const variableNames = getVariableNames(item.category);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between ml-10 m-5">
        <BackButton />
      </div>

      <div className="flex flex-col lg:flex-row mr-10 ml-10">
        <div className="card mx-auto w-full max-w-2xl sm:max-w-7xl bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="grid gap-x-8 gap-y-8 px-4 py-12">
              <div className="flex flex-col">
                <div className="flex flex-wrap gap-2 mb-1">
                  <h1 className="card-title">{item.id}</h1>
                  <h1 className="card-title">{item.sp}</h1>
                </div>
                <div className="flex flex-wrap gap-6">
                  <h2 className="card-title text-3xl font-bold tracking-tight sm:text-4xl">
                    {item.name}
                  </h2>
                  <h2 className="card-title text-3xl font-bold tracking-tight sm:text-4xl">
                    {item.rarity}
                  </h2>
                </div>
                <div className="border-t border-gray-200 mt-2"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="flex flex-col">
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col">
                      <dt className="font-medium">種類</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.category}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">タイプ</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.type}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">色</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.color}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">レベル</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.lv}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">グロウコスト</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.grow_cost}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">コスト</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.cost}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">リミット</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.limit}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">パワー</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.power}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">{variableNames.variable1}</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.variable1}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">{variableNames.variable2}</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.variable2}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">フォーマット</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.format}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="font-medium">ストーリー</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.story}</dd>
                    </div>
                    <div className="flex flex-col col-span-1 sm:col-span-2">
                      <dt className="font-medium">効果</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.effect}</dd>
                    </div>
                    <div className="flex flex-col col-span-1 sm:col-span-2">
                      <dt className="font-medium">フレーバー</dt>
                      <div className="border-t border-gray-200 mt-2"></div>
                      <dd className="mt-2">{item.flavor}</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex flex-col">{LinkItems(urlData)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}