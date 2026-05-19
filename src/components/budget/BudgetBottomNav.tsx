"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BudgetBottomNavProps {
  onFabClick: () => void;
}

const tabs: { id: string; label: string; path: string }[] = [
  { id: "overview", label: "Overview", path: "/budget" },
  { id: "analytics", label: "Analytics", path: "/budget/reports" },
  { id: "categories", label: "Categories", path: "/budget/categories" },
  { id: "settings", label: "Settings", path: "/budget/transactions" },
];

export function BudgetBottomNav({ onFabClick }: BudgetBottomNavProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const activeTab = tabs.find((t) => pathname.startsWith(t.path))?.id || "overview";

  return (
    <>
      {/* FAB — positioned above nav, independent */}
      <button
        type="button"
        onClick={onFabClick}
        className="fixed left-1/2 -translate-x-1/2 w-[56px] h-[56px] rounded-full bg-[#FF6B00] text-white fab-pulse flex items-center justify-center active:scale-[0.93] transition-transform shadow-lg shadow-orange-500/30"
        aria-label="Add transaction"
        style={{ bottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + 12px)", zIndex: 101 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/>
        </svg>
      </button>

      {/* Bottom Nav */}
      <nav className="glass-bottom-nav">
        <div className="bottom-nav-grid px-1">
          {tabs.slice(0, 2).map((tab) => navButton(tab))}
          <div /> {/* center spacer for FAB */}
          {tabs.slice(2).map((tab) => navButton(tab))}
        </div>
      </nav>
    </>
  );

  function navButton(tab: (typeof tabs)[0]) {
    const active = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        type="button"
        onClick={() => navigate(tab.path)}
        className="touch-target flex-col gap-0 rounded-lg transition-all active:scale-95"
        style={active ? { color: "#FF6B00" } : { color: "#55555C" }}
        aria-label={tab.label}
      >
        {tab.id === "overview" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        )}
        {tab.id === "analytics" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
        )}
        {tab.id === "categories" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l-9 5v10l9 5 9-5V7z"/><path d="M12 12l-9-5M12 12v10M21 7l-9 5"/>
          </svg>
        )}
        {tab.id === "settings" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        )}
        {active && <div className="w-[3px] h-[3px] rounded-full bg-[#FF6B00]" />}
        <span
          className="bottom-nav-label font-bold uppercase tracking-[0.04em]"
          style={active ? { color: "#FF6B00", fontSize: "9px" } : { color: "#55555C", fontSize: "9px" }}
        >
          {tab.label}
        </span>
      </button>
    );
  }
}
