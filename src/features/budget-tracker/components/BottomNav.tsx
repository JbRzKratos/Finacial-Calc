"use client";

import type { TabId } from "../types/budget";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Plus, History, BarChart3, Settings } from "lucide-react";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "history", label: "History", icon: History },
  { id: "add", label: "Add", icon: Plus },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="bg-neutral-900/95 backdrop-blur-2xl border-t border-white/5 px-3 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          const isAdd = tab.id === "add";
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(isAdd ? "add" : tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-300 no-underline",
                isAdd
                  ? "w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-[0_4px_16px_rgba(139,92,246,0.45)] rounded-full -mt-3"
                  : active
                    ? "min-w-[56px] px-2.5 py-2 bg-white/10 text-white"
                    : "min-w-[56px] px-2.5 py-2 text-white/40 hover:text-white/70"
              )}
            >
              <Icon size={isAdd ? 22 : 18} className={cn("transition-all", active && !isAdd ? "drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]" : "")} />
              {!isAdd && (
                <span className="text-[9px] font-bold uppercase tracking-[0.06em] leading-tight text-center">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
