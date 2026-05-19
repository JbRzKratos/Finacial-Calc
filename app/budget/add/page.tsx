"use client";

import { useRouter } from "next/navigation";
import { BudgetBottomNav } from "@/components/budget/BudgetBottomNav";
import { ArrowLeft } from "lucide-react";

export default function AddPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-[#1A1A1A] text-white pb-[calc(64px+env(safe-area-inset-bottom))] flex flex-col items-center justify-center px-5">
      <button
        type="button"
        onClick={() => router.push("/budget")}
        className="absolute top-5 left-5 w-9 h-9 rounded-xl bg-[#242424] flex items-center justify-center hover:bg-[#2E2E2E] transition-colors"
      >
        <ArrowLeft size={18} className="text-white/70" />
      </button>
      <p className="text-white/50 text-sm mb-6">Use the + button in the bottom nav</p>
      <BudgetBottomNav onFabClick={() => router.push("/budget")} />
    </div>
  );
}
