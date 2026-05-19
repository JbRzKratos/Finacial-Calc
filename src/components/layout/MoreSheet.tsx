"use client";

import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";

const CALC_TOOLS = [
  { label: "SIP", route: "/calculator/sip", icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.6)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: "EMI", route: "/calculator/emi", icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.6)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20"/></svg> },
  { label: "FD", route: "/calculator/fd", icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.6)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { label: "CAGR", route: "/calculator/cagr", icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.6)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
  { label: "Retirement", route: "/calculator/retirement", icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.6)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { label: "Tax", route: "/calculator/tax", icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.6)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { label: "Loan vs Invest", route: "/calculator/loanvsinvest", icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a ? "#FF6B00" : "rgba(255,255,255,0.6)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg> },
];

interface MoreSheetProps {
  open: boolean;
  onClose: () => void;
}

export function MoreSheet({ open, onClose }: MoreSheetProps) {
  const navigate = useNavigate();

  const handleNavigate = useCallback((route: string) => {
    navigate(route);
    onClose();
  }, [navigate, onClose]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="more-sheet-backdrop" onClick={handleBackdrop}>
      <div className="more-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="w-9 h-1 rounded-full bg-[#333] mx-auto mb-5" />
        <p className="text-[13px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-4">All Tools</p>
        <div className="grid grid-cols-4 gap-2">
          {CALC_TOOLS.map((tool) => (
            <button
              key={tool.route}
              type="button"
              onClick={() => handleNavigate(tool.route)}
              className="more-sheet-btn"
            >
              <div className="more-sheet-btn-icon">{tool.icon(false)}</div>
              <span className="more-sheet-btn-label">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
