// pages/index.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const BackButton: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("hasVisited")) {
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleBack = () => {
    // セッションに訪問履歴があるか、リファラーが同一ドメイン内のものであるかチェック
    if (window.history.length > 1 && sessionStorage.getItem("hasVisited")) {
      router.back();
    } else {
      router.push("/"); // 訪問履歴がない、またはリファラーが外部の場合はトップページにリダイレクト
    }
  };

  return (
    <button onClick={handleBack} className="link text-sm">
      戻る
    </button>
  );
};

export default BackButton;
