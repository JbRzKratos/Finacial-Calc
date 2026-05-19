"use client";

import dynamic from "next/dynamic";

const SpendingChartInner = dynamic(
  () => import("./SpendingChartInner"),
  { ssr: false, loading: () => <div className="h-48 rounded-2xl bg-[#242424] border border-[#2E2E2E] flex items-center justify-center text-[#888888] text-sm">Loading chart...</div> }
);

export { SpendingChartInner as SpendingChart };
