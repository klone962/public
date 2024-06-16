/// 詳細検索用サイドバーコンポネート
"use client";
import React from "react";
import { SeriesList } from "../data/TopVieSeries";
import { useRouter } from "next/navigation";

interface Props {
  Boosters: SeriesList[];
}

const ProductCards: React.FC<Props> = ({ Boosters }) => {
  const router = useRouter();

  const handleCardClick = (queri: string) => {
    router.push(`/search?series=${queri}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {Boosters.length > 0 ? (
        Boosters.map((booster) => (
          <div
            key={booster.id}
            className="card bg-base-100 shadow-xl m-2 cursor-pointer"
            onClick={() => handleCardClick(booster.query)}
          >
            <div className="card-body">
              <h2 className="card-title flex justify-center items-center">
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
