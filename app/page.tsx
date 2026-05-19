import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#0A0A0C] bg-noise bg-dot-grid bg-glow-orange flex flex-col items-center justify-center p-5">
      {/* Wordmark */}
      <div className="w-full max-w-lg mb-12 md:mb-16">
        <Link to="/" className="inline-flex items-center gap-2.5 no-underline group">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="2" y="2" width="24" height="24" rx="6" fill="#FF6B00" fillOpacity="0.12"/>
            <path d="M7 18L11 10L15 14L21 7" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="21" cy="7" r="2" fill="#FF6B00"/>
          </svg>
          <span className="text-sm font-bold text-[#FF6B00] tracking-wider uppercase">FinCalc Pro</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="w-full max-w-lg text-center mb-10">
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#6B6B70] tracking-[-0.02em] leading-tight">
          Your complete financial toolkit
        </h1>
        <p className="text-sm text-[#8A8A90] mt-2 max-w-sm mx-auto">
          Calculators and budget tracker in one place.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="w-full max-w-lg flex flex-col md:flex-row gap-4">
        <Link
          to="/calculator/sip"
          className="flex-1 glass-card p-6 no-underline group"
          style={{ animation: "cardSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0ms both" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-[28px] h-[28px] rounded-lg bg-[#FF6B00]/15 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <path d="M9 8v8M12 8v8M15 8v8M18 8v8"/>
              </svg>
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#F5F5F5] tracking-[-0.02em]">Financial Calculators</h2>
              <p className="text-[13px] text-[#8A8A90] mt-1 leading-relaxed line-clamp-2">
                SIP, EMI, FD, CAGR, retirement, tax, and loan vs invest — all in one place.
              </p>
              <div className="inline-flex items-center gap-1 mt-3 text-[13px] font-semibold text-[#FF6B00] group-hover:gap-2 transition-all">
                Open
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-[2px]">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/budget"
          className="flex-1 glass-card p-6 no-underline group"
          style={{ animation: "cardSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) 120ms both" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-[28px] h-[28px] rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#F5F5F5] tracking-[-0.02em]">Budget Tracker</h2>
              <p className="text-[13px] text-[#8A8A90] mt-1 leading-relaxed line-clamp-2">
                Track monthly spending, set budgets per category, and view spending analytics.
              </p>
              <div className="inline-flex items-center gap-1 mt-3 text-[13px] font-semibold text-[#FF6B00] group-hover:gap-2 transition-all">
                Open
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-[2px]">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
