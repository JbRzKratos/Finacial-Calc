"use client";

import { type ReactNode } from "react";
import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { Toaster } from "@/components/ui/toaster";

interface PageLayoutProps {
  children: ReactNode;
  noNav?: boolean;
}

export function PageLayout({ children, noNav }: PageLayoutProps) {
  return (
    <div className="app-root">
      <div className="min-h-dvh bg-[#0A0A0C] bg-noise relative">
        {children}

        {!noNav && <AppBottomNav />}

        <Toaster />
      </div>
    </div>
  );
}
