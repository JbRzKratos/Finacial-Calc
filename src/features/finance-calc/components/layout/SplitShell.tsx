"use client";

import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { MobileResultsProvider, useMobileResults } from "@/features/finance-calc/contexts/MobileResultsContext";

interface SplitShellProps {
  left: ReactNode;
  right: ReactNode;
}

function SplitShellContent({ left, right }: SplitShellProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { showMobileResults, setShowMobileResults } = useMobileResults();

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
          <header className="app-header">
            <div className="app-header-left">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-1 text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 px-2 h-9"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </Button>
            </div>
            <span className="app-header-title">Calculator</span>
            <div className="app-header-right" />
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileResults(false)}
              className="gap-1.5 text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 mb-4 h-9"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Back to Inputs</span>
            </Button>
            {right}
          </div>
        </div>
      )}

      <AppBottomNav />
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
