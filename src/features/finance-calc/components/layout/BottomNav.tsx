"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  PiggyBank,
  Building2,
  Calculator,
  TrendingUp,
  Target,
  Receipt,
  Scale,
  Wallet,
} from "lucide-react";
import { useRef, useEffect } from "react";

const tabs = [
  { href: "/calculator/sip", label: "SIP", icon: PiggyBank },
  { href: "/calculator/emi", label: "EMI", icon: Building2 },
  { href: "/calculator/fd", label: "FD", icon: Calculator },
  { href: "/calculator/cagr", label: "CAGR", icon: TrendingUp },
  { href: "/calculator/retirement", label: "RETIRE", icon: Target },
  { href: "/calculator/tax", label: "TAX", icon: Receipt },
  { href: "/calculator/loanvsinvest", label: "COMPARE", icon: Scale },
  { href: "/budget", label: "BUDGET", icon: Wallet },
];

export function BottomNav() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const idx = tabs.findIndex((t) => pathname === t.href);
    if (idx < 0) return;
    const el = scrollRef.current.children[idx] as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingBottom: "calc(8px + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-3 w-full max-w-[calc(100vw-24px)] pointer-events-auto bg-[#1A1A1A]/90  backdrop-blur-2xl rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)]">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-0.5 px-2 py-2 no-scrollbar"
        >
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn( "flex flex-col items-center justify-center gap-0.5 snap-center shrink-0 no-underline transition-all duration-300 rounded-xl min-w-[64px] px-2.5 py-2",
                  active
                    ? "bg-brand-primary text-white shadow-[0_4px_16px_rgba(255,107,0,0.45)] scale-105"
                    : "text-white/50  hover:text-white/80 hover:bg-white/10"
                )}
              >
                <Icon
                  size={18}
                  className={cn( "transition-all duration-300",
                    active ? "drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]" : ""
                  )}
                />
                <span className="text-[9px] font-bold uppercase tracking-[0.06em] leading-tight text-center whitespace-nowrap">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
