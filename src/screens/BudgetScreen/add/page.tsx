"use client";

import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/common/PageLayout/PageLayout";

export default function AddPage() {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <div className="page-scroll-container flex flex-col items-center justify-center min-h-dvh">
        <button type="button" onClick={() => navigate("/")} className="absolute top-5 left-5 touch-target w-9 h-9 rounded-xl bg-[#141416] border border-[rgba(255,255,255,0.06)] hover:bg-[#1C1C1F] transition-all" aria-label="Home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <p className="text-[#8A8A90] text-sm">Use the + button in the bottom nav</p>
      </div>
    </PageLayout>
  );
}
