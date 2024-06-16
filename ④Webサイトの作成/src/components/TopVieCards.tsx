/// 詳細検索用サイドバーコンポネート
"use client";

import React from "react";
import { SearchTargetList } from "../data/TopVieSeries";
import { useRouter } from "next/navigation";

interface Props {
  Boosters: SearchTargetList[];
}

const ProductCards: React.FC<Props> = ({ Boosters }) => {
  const router = useRouter();

  const handleCardClick = (queri: string) => {
    router.push(`${queri}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 flex items-center justify-center">
      {Boosters.length > 0 ? (
        Boosters.map((booster) => (
          <div
            key={booster.id}
            className="card bg-base-100 shadow-xl m-2 cursor-pointer"
            onClick={() => handleCardClick(booster.link)}
          >
            <div className="card-body">
              <h2 className="card-title flex items-center justify-center">
                {booster.name}
              </h2>
            </div>
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductCards;
