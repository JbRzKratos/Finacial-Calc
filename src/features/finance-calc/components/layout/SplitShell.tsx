"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { MobileResultsProvider, useMobileResults } from "@/features/finance-calc/contexts/MobileResultsContext";

interface SplitShellProps {
  left: ReactNode;
  right: ReactNode;
}

function SplitShellContent({ left, right }: SplitShellProps) {
  const pathname = usePathname();
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
          className="panel-orange overflow-y-auto"
          style={{ height: "100dvh", position: "sticky", top: 0 }}
        >
          <div className="max-w-[420px] mx-auto px-5 pt-6 pb-24 md:px-7 md:py-8 animate-panel-enter">
            {left}
          </div>
        </section>
        <section
          id="results"
          className="bg-brand-white overflow-y-auto scroll-fade-bottom max-md:hidden"
          style={{ height: "100dvh" }}
        >
          <div className="max-w-[560px] mx-auto px-5 py-6 md:px-9 md:py-8 animate-page-enter">
            {right}
          </div>
        </section>
      </main>

      {showMobileResults && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-brand-white overflow-hidden animate-slide-up"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="px-5 pt-4 pb-[calc(24px+env(safe-area-inset-bottom))]">
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
    </>
  );
}

export function SplitShell({ left, right }: SplitShellProps) {
  return (
    <MobileResultsProvider>
      <SplitShellContent left={left} right={right} />
      <BottomNav />
    </MobileResultsProvider>
  );
}
