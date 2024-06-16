// pages/index.tsx
"use client";
import React, { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";

import ProductCards from "../../components/ProductCards";
import { BoosterPack } from "../../data/TopVieSeries";

import Breadcrumbs from "../../components/Breadcrumbs";
import { generateBreadcrumbs } from "../../scripts/GenerateBreadcrumbs";

export default function Booster() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        }
      >
        <BoosterContent />
      </Suspense>
    </main>
  );
}

function BoosterContent() {
  const params = useSearchParams();
  const pathname = usePathname();

  const query = new URLSearchParams(params);
  const breadcrumbs = generateBreadcrumbs(pathname, query);
  return (
    <main>
      <div className="breadcrumbs ml-10">{Breadcrumbs(breadcrumbs)}</div>
      <div className="divider divider-neutral">ブースターパックから検索</div>
      <div className="ml-10 mr-10">
        <ProductCards Boosters={BoosterPack} />
      </div>
    </main>
  );
}
