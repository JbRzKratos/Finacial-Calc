"use client";

import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calculator, Wallet } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  PiggyBank,
  Landmark,
  TrendingUp,
  Clock,
  FileText,
  Scale,
  BarChart3,
} from "lucide-react";

const tools = [
  { id: "sip", label: "SIP", icon: PiggyBank },
  { id: "emi", label: "EMI", icon: Landmark },
  { id: "fd", label: "FD", icon: TrendingUp },
  { id: "cagr", label: "CAGR", icon: BarChart3 },
  { id: "retirement", label: "Retirement", icon: Clock },
  { id: "tax", label: "Tax", icon: FileText },
  { id: "loanvsinvest", label: "Loan vs Invest", icon: Scale },
];

export function AppBottomNav() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (tabId: string) => {
    if (tabId === "home") return pathname === "/";
    if (tabId === "calculators") return pathname.startsWith("/calculator");
    if (tabId === "budget") return pathname.startsWith("/budget");
    return false;
  };

  const handleTab = (tabId: string) => {
    if (tabId === "home") navigate("/");
    else if (tabId === "calculators") setOpen((p) => !p);
    else if (tabId === "budget") navigate("/budget");
  };

  const handleSelect = useCallback((id: string) => {
    navigate(`/calculator/${id}`);
    setOpen(false);
  }, [navigate]);

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "calculators", label: "Calculators", icon: Calculator },
    { id: "budget", label: "Budget", icon: Wallet },
  ];

  return (
    <>
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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="bg-[#141416] border-t border-white/[0.06] rounded-t-3xl px-5 pb-24 max-h-[70vh]"
        >
          <div className="mx-auto w-9 h-1 bg-white/20 rounded-full mb-4" />
          <SheetHeader className="text-left mb-5">
            <SheetTitle className="text-foreground font-semibold text-lg">
              All Calculators
            </SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-4 gap-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleSelect(tool.id)}
                  className="more-sheet-btn"
                >
                  <div className="more-sheet-btn-icon">
                    <Icon size={20} className="text-white/60" />
                  </div>
                  <span className="more-sheet-btn-label">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
