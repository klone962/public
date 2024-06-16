"use client";

import React from "react";
import Link from "next/link";

export default function BaseHeader() {
  return (
    <div>
      <Link href={`/`}>
        <div className="btn btn-ghost text-xl">wixoss価格検索</div>
      </Link>
    </div>
  );
}
