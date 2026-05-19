"use client";

import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  {
    id: "home",
    label: "Home",
    route: "/",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    id: "calculators",
    label: "Calculators",
    route: "/calculator/sip",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M9 8v8M12 8v8M15 8v8M18 8v8"/>
      </svg>
    ),
  },
  {
    id: "budget",
    label: "Budget",
    route: "/budget",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20"/>
        <circle cx="12" cy="12" r="2" fill={active ? "#FF6B00" : "rgba(255,255,255,0.35)"} fillOpacity={active ? "1" : "0.35"}/>
      </svg>
    ),
  },
  {
    id: "more",
    label: "More",
    route: null,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" fill={active ? "#FF6B00" : "rgba(255,255,255,0.35)"}/>
        <circle cx="5" cy="12" r="1" fill={active ? "#FF6B00" : "rgba(255,255,255,0.35)"}/>
        <circle cx="19" cy="12" r="1" fill={active ? "#FF6B00" : "rgba(255,255,255,0.35)"}/>
      </svg>
    ),
  },
];

interface AppBottomNavProps {
  onMoreOpen: () => void;
}

export function AppBottomNav({ onMoreOpen }: AppBottomNavProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const isActive = (tabId: string) => {
    if (tabId === "home") return pathname === "/";
    if (tabId === "calculators") return pathname.startsWith("/calculator");
    if (tabId === "budget") return pathname.startsWith("/budget");
    return false;
  };

  const handleTab = (tab: typeof TABS[number]) => {
    if (tab.id === "more") {
      onMoreOpen();
    } else if (tab.route) {
      navigate(tab.route);
    }
  };

  return (
    <nav className="app-bottom-nav">
      <div className="app-bottom-nav-inner">
        {TABS.map((tab) => {
          const active = isActive(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTab(tab)}
              className="app-bottom-nav-btn"
            >
              <div className="app-bottom-nav-icon-wrap">
                {tab.icon(active)}
                {active && <div className="app-bottom-nav-dot" />}
              </div>
              <span className="app-bottom-nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
