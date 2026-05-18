"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = pathname.split("/").filter(Boolean).pop() || "sip";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentId={current} />
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
