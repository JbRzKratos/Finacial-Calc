import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Home() {
  return (
    <PageLayout noNav>
    <div className="flex flex-col items-center justify-center p-5 relative overflow-hidden min-h-dvh">
      {/* Wordmark */}
      <div className="w-full max-w-lg mb-10 md:mb-14">
        <Link to="/" className="inline-flex items-center gap-2.5 no-underline group">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="2" y="2" width="24" height="24" rx="6" fill="rgba(255,255,255,0.06)"/>
            <path d="M7 18L11 10L15 14L21 7" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="21" cy="7" r="2" fill="rgba(255,255,255,0.5)"/>
          </svg>
          <span className="text-sm font-bold text-white/50 tracking-wider uppercase">FinCalc Pro</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="w-full max-w-lg text-center mb-10 md:mb-12">
        <h1 className="text-[30px] md:text-[40px] font-bold text-[#F5F5F5] tracking-[-0.02em] leading-tight">
          Your complete<br />financial toolkit
        </h1>
        <p className="text-sm text-[#8A8A90] mt-3 max-w-sm mx-auto leading-relaxed">
          Seven powerful calculators and a full budget tracker — designed for clarity.
        </p>
      </div>

      {/* Premium Feature Cards */}
      <div className="w-full max-w-lg flex flex-col md:flex-row gap-4 relative">
        {/* Calculator Card */}
        <Link
          to="/calculator/sip"
          className="home-card home-card-calc home-card-enter-1 p-6 flex-1"
        >
          {/* Top section */}
          <div className="flex items-start justify-between mb-5">
            <div className="home-card-icon-ring">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <path d="M9 8v8M12 8v8M15 8v8M18 8v8"/>
              </svg>
            </div>
            <span className="home-card-badge">7 tools</span>
          </div>

          {/* Text */}
          <h2 className="text-[19px] font-bold text-[#F5F5F5] tracking-[-0.02em] mb-1.5">
            Financial Calculators
          </h2>
          <p className="text-[13px] text-[#8A8A90] leading-relaxed mb-5">
            SIP, EMI, FD, CAGR, retirement planning, tax savings & loan vs invest.
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            <span className="home-card-tag">SIP</span>
            <span className="home-card-tag">EMI</span>
            <span className="home-card-tag">FD</span>
            <span className="home-card-tag">CAGR</span>
            <span className="home-card-tag">Tax</span>
          </div>

          {/* Arrow */}
          <div className="home-card-arrow mt-auto">
            Open Calculators
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </Link>

        {/* Budget Card */}
        <Link
          to="/budget"
          className="home-card home-card-budget home-card-enter-2 p-6 flex-1"
        >
          {/* Top section */}
          <div className="flex items-start justify-between mb-5">
            <div className="home-card-icon-ring">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20"/>
                <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.4)"/>
              </svg>
            </div>
            <span className="home-card-badge">New</span>
          </div>

          {/* Text */}
          <h2 className="text-[19px] font-bold text-[#F5F5F5] tracking-[-0.02em] mb-1.5">
            Budget Tracker
          </h2>
          <p className="text-[13px] text-[#8A8A90] leading-relaxed mb-5">
            Track spending, set category budgets, and view rich monthly analytics.
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            <span className="home-card-tag">Dashboard</span>
            <span className="home-card-tag">Analytics</span>
            <span className="home-card-tag">Categories</span>
            <span className="home-card-tag">Reports</span>
          </div>

          {/* Arrow */}
          <div className="home-card-arrow mt-auto">
            Open Budget
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </Link>
      </div>
    </div>
    </PageLayout>
  );
}
