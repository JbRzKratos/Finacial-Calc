"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calculator, Wallet } from "lucide-react";

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
    { id: "home", label: "Home", icon: Home },
    { id: "calculators", label: "Calculators", icon: Calculator },
    { id: "budget", label: "Budget", icon: Wallet },
  ];

  return (
    <nav className="app-bottom-nav">
      <div className="app-bottom-nav-inner">
        {tabs.map((tab) => {
          const active = isActive(tab.id);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTab(tab.id)}
              className="app-bottom-nav-btn"
            >
              <div className="app-bottom-nav-icon-wrap">
                <Icon
                  size={22}
                  className={active ? "text-orange-500" : "text-white/35"}
                  strokeWidth={active ? 2 : 1.8}
                />
                {active && <div className="app-bottom-nav-dot" />}
              </div>
              <span className="app-bottom-nav-label" style={{ color: active ? "#FF6B00" : undefined }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
