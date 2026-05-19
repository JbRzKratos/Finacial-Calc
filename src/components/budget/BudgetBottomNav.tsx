"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BudgetBottomNavProps {
  onFabClick: () => void;
}

const tabs: { id: string; label: string; icon: ReactNode; path: string }[] = [
  { id: "overview", label: "Overview", icon: <span className="text-lg">≡</span>, path: "/budget" },
  { id: "analytics", label: "Analytics", icon: <span className="text-lg">📊</span>, path: "/budget/reports" },
  { id: "categories", label: "Categories", icon: <span className="text-lg">⊞</span>, path: "/budget/categories" },
  { id: "settings", label: "Settings", icon: <span className="text-lg">○</span>, path: "/budget/transactions" },
];

export function BudgetBottomNav({ onFabClick }: BudgetBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = tabs.find((t) => pathname.startsWith(t.path))?.id || "overview";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-[#2E2E2E]"
      style={{ height: "calc(64px + env(safe-area-inset-bottom))", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-full px-2 relative">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => router.push(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 rounded-lg transition-all",
                active ? "bg-[rgba(255,107,0,0.1)] text-[#FF6B00]" : "text-[#555555] hover:text-[#888888]"
              )}
            >
              <div className="relative">
                {active && <div className="w-[3px] h-[3px] rounded-full bg-[#FF6B00] absolute -top-2 left-1/2 -translate-x-1/2" />}
                {tab.icon}
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-[0.04em]", active ? "text-[#FF6B00]" : "text-[#555555]")}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* FAB */}
        <button
          type="button"
          onClick={onFabClick}
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-[58px] h-[58px] rounded-full bg-[#FF6B00] text-white shadow-[0_4px_20px_rgba(255,107,0,0.5),0_0_0_4px_#1A1A1A] flex items-center justify-center hover:shadow-[0_6px_24px_rgba(255,107,0,0.7)] active:scale-[0.93] transition-all z-10"
          aria-label="Add transaction"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
