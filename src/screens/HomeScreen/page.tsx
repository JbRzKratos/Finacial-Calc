import { Link } from "react-router-dom";
import { PageLayout } from "@/components/common/PageLayout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Wallet, TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <PageLayout noNav>
      <div className="flex flex-col items-center justify-center p-5 relative overflow-hidden min-h-dvh">
        <div className="w-full max-w-lg mb-10 md:mb-14">
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline group">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <TrendingUp size={16} className="text-white/50" />
            </div>
            <span className="text-sm font-bold text-white/50 tracking-wider uppercase">FinCalc Pro</span>
          </Link>
        </div>

        <div className="w-full max-w-lg text-center mb-10 md:mb-12">
          <h1 className="text-[30px] md:text-[40px] font-bold text-[#F5F5F5] tracking-[-0.02em] leading-tight">
            Your complete<br />financial toolkit
          </h1>
          <p className="text-sm text-[#8A8A90] mt-3 max-w-sm mx-auto leading-relaxed">
            Seven powerful calculators and a full budget tracker — designed for clarity.
          </p>
        </div>

        <div className="w-full max-w-lg flex flex-col md:flex-row gap-4 relative">
          <Link to="/calculator/sip" className="home-card home-card-calc home-card-enter-1 flex-1">
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-0">
                <div className="flex items-start justify-between mb-5">
                  <div className="home-card-icon-ring">
                    <Calculator size={22} className="text-white/60" />
                  </div>
                  <span className="home-card-badge">7 tools</span>
                </div>
                <h2 className="text-[19px] font-bold text-[#F5F5F5] tracking-[-0.02em] mb-1.5">
                  Financial Calculators
                </h2>
                <p className="text-[13px] text-[#8A8A90] leading-relaxed mb-5">
                  SIP, EMI, FD, CAGR, retirement planning, tax savings & loan vs invest.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className="home-card-tag">SIP</span>
                  <span className="home-card-tag">EMI</span>
                  <span className="home-card-tag">FD</span>
                  <span className="home-card-tag">CAGR</span>
                  <span className="home-card-tag">Tax</span>
                </div>
                <div className="home-card-arrow mt-auto">
                  Open Calculators
                  <ArrowRight size={14} />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/budget" className="home-card home-card-budget home-card-enter-2 flex-1">
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="p-6 flex flex-col gap-0">
                <div className="flex items-start justify-between mb-5">
                  <div className="home-card-icon-ring">
                    <Wallet size={22} className="text-white/60" />
                  </div>
                  <span className="home-card-badge">New</span>
                </div>
                <h2 className="text-[19px] font-bold text-[#F5F5F5] tracking-[-0.02em] mb-1.5">
                  Budget Tracker
                </h2>
                <p className="text-[13px] text-[#8A8A90] leading-relaxed mb-5">
                  Track spending, set category budgets, and view rich monthly analytics.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className="home-card-tag">Dashboard</span>
                  <span className="home-card-tag">Analytics</span>
                  <span className="home-card-tag">Categories</span>
                  <span className="home-card-tag">Reports</span>
                </div>
                <div className="home-card-arrow mt-auto">
                  Open Budget
                  <ArrowRight size={14} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
