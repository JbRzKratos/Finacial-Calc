"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/calculator/sip", label: "SIP" },
  { href: "/calculator/emi", label: "EMI" },
  { href: "/calculator/fd", label: "FD" },
  { href: "/calculator/cagr", label: "CAGR" },
  { href: "/calculator/retirement", label: "RETIREMENT" },
  { href: "/calculator/tax", label: "TAX" },
  { href: "/calculator/loanvsinvest", label: "COMPARE" },
];

const pageNames: Record<string, string> = {
  "/calculator/sip": "SIP",
  "/calculator/emi": "EMI",
  "/calculator/fd": "FD",
  "/calculator/cagr": "CAGR",
  "/calculator/retirement": "RETIREMENT",
  "/calculator/tax": "TAX",
  "/calculator/loanvsinvest": "COMPARE",
  "/calculator": "CALCULATORS",
  "/": "HOME",
};

export function TopNav() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem("fincalc_theme", next); } catch {}
  };

  const currentPage = pageNames[pathname] || "";

  return (
    <>
      {/* ─── Desktop header ─── */}
      <header className="hidden md:flex h-15 bg-white dark:bg-[#1A1A1A] border-b border-brand-gray-mid dark:border-white/10 items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-0.5 no-underline">
          <span className="animate-logo-brand text-[16px] font-bold tracking-[0.2em] text-brand-black dark:text-white">FINCALC</span>
          <span className="animate-logo-accent text-[16px] font-bold tracking-[0.2em] text-brand-primary">PRO</span>
        </Link>
        <nav className="flex items-center gap-1.5">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-[12px] font-semibold uppercase tracking-[0.06em] no-underline transition-all duration-200 rounded-lg px-[14px] py-[6px] relative",
                  active
                    ? "bg-brand-primary text-white font-bold shadow-[0_0_16px_rgba(255,107,0,0.5),0_4px_12px_rgba(255,107,0,0.3)]"
                    : "text-brand-gray-dark dark:text-white/70 hover:bg-brand-primary/10 hover:text-brand-primary"
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-brand-primary shadow-[0_0_8px_rgba(255,107,0,0.8)] animate-[navDotPulse_2s_ease-in-out_infinite]" />
                )}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center text-brand-gray-dark dark:text-white/70 hover:text-brand-black dark:hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* ─── Mobile floating glass pill ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: "calc(12px + env(safe-area-inset-top))" }}
      >
        <div className="mx-3 w-full max-w-[calc(100vw-24px)] pointer-events-auto bg-[#1A1A1A]/90 dark:bg-white/10 backdrop-blur-2xl rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between px-4 h-11">
            <Link href="/" className="flex items-center gap-1 no-underline shrink-0">
              <span className="text-[13px] font-black tracking-[0.2em] text-white">FINCALC</span>
              <span className="text-[13px] font-black tracking-[0.2em] text-brand-primary">PRO</span>
            </Link>

            {currentPage && (
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/70 truncate mx-2">
                {currentPage}
              </span>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
