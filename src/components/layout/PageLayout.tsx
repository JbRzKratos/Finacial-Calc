"use client";

import { type ReactNode, useState } from "react";
import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { MoreSheet } from "@/components/layout/MoreSheet";

interface PageLayoutProps {
  children: ReactNode;
  noNav?: boolean;
}

export function PageLayout({ children, noNav }: PageLayoutProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="app-root">
      <div className="min-h-dvh bg-[#0A0A0C] bg-noise relative">
        {children}

        {!noNav && (
          <>
            <AppBottomNav onCalculatorOpen={() => setMoreOpen(true)} />
            <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
}
