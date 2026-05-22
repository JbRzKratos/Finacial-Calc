/* src/components/layout/BottomNav.tsx */

import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home as HomeIcon, Calculator as CalcIcon, Wallet as WalletIcon } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isCalculatorsActive = pathname === "/" || pathname.startsWith("/calculator");
  const isBudgetActive = pathname.startsWith("/budget");

  return (
    <div className="app-bottom-nav">
      <div className="app-bottom-nav-inner">
        
        {/* Calculators Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className={cn("app-bottom-nav-btn", isCalculatorsActive && "active")}
        >
          {isCalculatorsActive && <div className="app-bottom-nav-active-pill" />}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <CalcIcon className="w-5 h-5" />
            <span className="app-bottom-nav-label mt-1">
              Calculators
            </span>
          </div>
        </button>

        {/* Budget Button */}
        <button
          type="button"
          onClick={() => navigate("/budget")}
          className={cn("app-bottom-nav-btn", isBudgetActive && "active")}
        >
          {isBudgetActive && <div className="app-bottom-nav-active-pill" />}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <WalletIcon className="w-5 h-5" />
            <span className="app-bottom-nav-label mt-1">
              Budget
            </span>
          </div>
        </button>

      </div>
    </div>
  );
}
