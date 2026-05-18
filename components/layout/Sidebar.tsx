"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CalcIcon } from "@/components/shared/CalcIcon";

const navItems = [
  { id: "sip", icon: "💰", label: "SIP", desc: "Grow savings" },
  { id: "emi", icon: "🏦", label: "EMI", desc: "Plan a loan" },
  { id: "fd", icon: "🏛️", label: "FD / RD", desc: "Safe deposit" },
  { id: "cagr", icon: "📊", label: "CAGR", desc: "Track growth" },
  { id: "retirement", icon: "🎯", label: "Retirement", desc: "Plan future" },
  { id: "tax", icon: "💸", label: "Tax Saver", desc: "Save tax" },
  { id: "loanvsinvest", icon: "⚖️", label: "Loan vs Invest", desc: "Compare options" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname.split("/").filter(Boolean).pop() || "sip";

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen sticky top-0 border-r bg-sidebar-background">
      <div className="p-5 border-b">
        <h1 className="text-lg font-bold">FinCalc Pro</h1>
        <p className="text-xs text-muted-foreground">Smart money decisions</p>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(`/calculator/${item.id}`)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              current === item.id
                ? "bg-calc-accent-bg text-calc-accent border-l-[3px] border-calc-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <CalcIcon name={item.icon} className="w-5 h-5 shrink-0" />
            <div>
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-[11px] text-muted-foreground">{item.desc}</span>
            </div>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">v1.0.0</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
