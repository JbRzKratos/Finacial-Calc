"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FinanceProvider } from "../contexts/FinanceContext";
import { BottomNav } from "../components/BottomNav";
import { Dashboard } from "../components/Dashboard";
import { AddTransaction } from "../components/AddTransaction";
import { TransactionList } from "../components/TransactionList";
import { Reports } from "../components/Reports";
import { SettingsView } from "../components/SettingsView";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { TabId } from "../types/budget";

function BudgetContent() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = useLocation().pathname;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [tab]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [pathname]);

  return (
    <div className="h-dvh flex flex-col bg-neutral-950 text-white">
      {/* Desktop top bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/calculator/sip" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Calculators
          </Link>
        </div>
        <h1 className="text-sm font-bold text-white/80">Budget Tracker</h1>
        <div className="w-24" />
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex max-w-5xl mx-auto md:gap-6 md:px-6 md:py-6">
          {/* Desktop sidebar tabs */}
          <aside className="hidden md:flex flex-col gap-1.5 w-48 shrink-0 sticky top-0 self-start pt-2">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2 px-3">Sections</p>
            {[
              { id: "dashboard" as TabId, label: "Dashboard", icon: "📊" },
              { id: "add" as TabId, label: "Add Transaction", icon: "➕" },
              { id: "history" as TabId, label: "History", icon: "📋" },
              { id: "reports" as TabId, label: "Reports", icon: "📈" },
              { id: "settings" as TabId, label: "Settings", icon: "⚙️" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all text-left ${
                  tab === item.id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </aside>

          <main className="flex-1 min-w-0">
            {tab === "dashboard" && <Dashboard onTabChange={setTab} />}
            {tab === "add" && <AddTransaction onTabChange={setTab} />}
            {tab === "history" && <TransactionList />}
            {tab === "reports" && <Reports />}
            {tab === "settings" && <SettingsView />}
          </main>
        </div>
      </div>

      {/* Bottom nav — natural flow, no overlap */}
      <div className="md:hidden shrink-0">
        <BottomNav activeTab={tab} onTabChange={setTab} />
      </div>
    </div>
  );
}

export default function BudgetApp() {
  return (
    <FinanceProvider>
      <BudgetContent />
    </FinanceProvider>
  );
}
