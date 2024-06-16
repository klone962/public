/// 詳細検索用サイドバーコンポネート
"use client";

import React from "react";
import { Category } from "../data/categories";

interface SidebarProps {
  categories: Category[];
  handleCheckboxChange: (categoryId: number, itemId: number) => void;
  handleUncheckAll: () => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  categories,
  handleCheckboxChange,
  handleUncheckAll,
}) => {
  return (
    <div className="menu p-4 min-h-full bg-base-200 text-base-content">
      <button
        onClick={handleUncheckAll}
        className="btn btn-neutral text-neutral-content mb-4"
      >
        チェックを外す
      </button>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <div className="collapse collapse-arrow">
              <input type="checkbox" className="collapse-open" />
              <div className="collapse-title text-xl font-medium">
                {category.name}
              </div>
              <div className="collapse-content flex flex-col justify-center gap-2 w-80">
                {category.items.map((item) => (
                  <div key={item.id} className="form-control">
                    <label className="label cursor-pointer flex gap-2">
                      <span className="label-text">{item.name}</span>
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() =>
                          handleCheckboxChange(category.id, item.id)
                        }
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarComponent;
