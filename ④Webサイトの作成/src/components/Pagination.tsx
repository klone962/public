"use client";
import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";

interface PaginationProps {
  currentPage: number; // 現在のページ番号
  totalPages: number; // 総ページ数
  limitPage: number; // 総ページ数
  onNavigate: (page: number) => void; // ページ遷移時の関数
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  limitPage,
  onNavigate,
}) => {
  // ページ遷移ハンドラ
  const handlePageChange = (page: number) => {
    onNavigate(page); // 親コンポーネントの関数を呼び出し
  };

  // 表示するページ数を現在のページの前後3ページに制限
  const visiblePages = Array.from(
    { length: totalPages }, // 全ページ数に基づいて配列を作成
    (_, i) => i + 1
  ).filter(
    (page) => page >= currentPage - 3 && page <= currentPage + 3 // 現在のページから前後3ページ
  );

  const totalItems = totalPages * limitPage;
  const startItem = (currentPage - 1) * limitPage + 1; // 表示される最初のアイテム番号
  const endItem = Math.min(currentPage * limitPage, totalItems); // 表示される最後のアイテム番号

  return (
    <div className="flex flex-wrap flex-1 items-center justify-center gap-2">
      <div>
        <p className="text-sm">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results (Page{" "}
          {currentPage} of {totalPages})
        </p>
      </div>
      <div>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
              currentPage === 1 ? "" : "hover:bg-neutral"
            }`}
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">First</span>
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
              currentPage === 1 ? "" : "hover:bg-neutral"
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </button>
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                currentPage === page ? "bg-neutral" : "hover:bg-neutral"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
              currentPage === totalPages || totalPages === 0
                ? ""
                : "hover:bg-neutral"
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
              currentPage === totalPages || totalPages === 0
                ? ""
                : "hover:bg-neutral"
            }`}
          >
            <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Last</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
