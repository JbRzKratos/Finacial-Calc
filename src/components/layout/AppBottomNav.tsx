"use client";

import { useLocation, useNavigate } from "react-router-dom";

interface AppBottomNavProps {
  onCalculatorOpen: () => void;
}

export function AppBottomNav({ onCalculatorOpen }: AppBottomNavProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const isActive = (tabId: string) => {
    if (tabId === "home") return pathname === "/";
    if (tabId === "calculators") return pathname.startsWith("/calculator");
    if (tabId === "budget") return pathname.startsWith("/budget");
    return false;
  };

  const handleTab = (tabId: string) => {
    if (tabId === "home") navigate("/");
    else if (tabId === "calculators") onCalculatorOpen();
    else if (tabId === "budget") navigate("/budget");
  };

  const tabs = [
    { id: "home", label: "Home", icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.35)"} strokeWidth={a ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    )},
    { id: "calculators", label: "Calculators", icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.35)"} strokeWidth={a ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M9 8v8M12 8v8M15 8v8M18 8v8"/>
      </svg>
    )},
    { id: "budget", label: "Budget", icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.35)"} strokeWidth={a ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20"/>
        <circle cx="12" cy="12" r="2" fill={a ? "#FF6B00" : "rgba(255,255,255,0.35)"} fillOpacity={a ? "1" : "0.35"}/>
      </svg>
    )},
  ];

  return (
    <nav className="app-bottom-nav">
      <div className="app-bottom-nav-inner">
        {tabs.map((tab) => {
          const active = isActive(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTab(tab.id)}
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
