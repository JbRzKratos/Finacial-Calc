"use client";

import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { MoreSheet } from "@/components/layout/MoreSheet";
import { MobileResultsProvider, useMobileResults } from "@/features/finance-calc/contexts/MobileResultsContext";

interface SplitShellProps {
  left: ReactNode;
  right: ReactNode;
}

function SplitShellContent({ left, right }: SplitShellProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { showMobileResults, setShowMobileResults } = useMobileResults();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <main
        key={pathname}
        className="flex flex-col md:grid md:grid-cols-[40%_60%]"
        style={{ height: "100dvh" }}
      >
        <section
          data-input-panel
          className="bg-[#0A0A0C] overflow-y-auto relative"
          style={{ height: "100dvh", position: "sticky", top: 0 }}
        >
          <div className="absolute inset-0 bg-noise pointer-events-none opacity-[0.025]" />
          <header className="calc-header">
            <button type="button" onClick={() => navigate("/")} className="calc-back-btn" aria-label="Back to home">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Home</span>
            </button>
            <span className="calc-header-title">Calculator</span>
            <div className="calc-header-spacer"></div>
          </header>

          <div className="max-w-[420px] mx-auto px-5 pb-24 md:px-7 md:py-4 animate-panel-enter">
            {left}
          </div>
        </section>
        <section
          id="results"
          className="bg-[#FAFAF9] overflow-y-auto scroll-fade-bottom max-md:hidden relative"
          style={{ height: "100dvh" }}
        >
          <div className="absolute inset-0 bg-noise pointer-events-none opacity-[0.015]" />
          <div className="max-w-[560px] mx-auto px-5 pt-6 md:px-9 md:pt-8 pb-24 animate-page-enter relative z-[1]">
            {right}
          </div>
        </section>
      </main>

      {showMobileResults && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-[#FAFAF9] overflow-y-auto animate-slide-up"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="px-5 pt-4" style={{ paddingBottom: "calc(96px + env(safe-area-inset-bottom))" }}>
            <button
              type="button"
              onClick={() => setShowMobileResults(false)}
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-primary mb-4 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft size={14} />
              Back to Inputs
            </button>
            {right}
          </div>
        </div>
      )}

      <AppBottomNav onMoreOpen={() => setMoreOpen(true)} />
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}

export function SplitShell({ left, right }: SplitShellProps) {
  return (
    <MobileResultsProvider>
      <SplitShellContent left={left} right={right} />
    </MobileResultsProvider>
  );
}
