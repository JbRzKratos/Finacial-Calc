/* src/components/common/PageLayout/PageLayout.tsx */

import { type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

interface PageLayoutProps {
  children: ReactNode;
  noNav?: boolean;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="app-root">
      <div className="min-h-dvh bg-[#0A0A0C] bg-noise relative">
        {children}
        <Toaster />
      </div>
    </div>
  );
}
PageLayout.displayName = 'PageLayout';
