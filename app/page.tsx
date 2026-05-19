import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#1A1A1A] flex items-center justify-center p-5">
      <div className="w-full max-w-lg space-y-5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-[-0.02em]">FinCalc Pro</h1>
          <p className="text-sm text-[#888888] mt-1">Your complete financial toolkit</p>
        </div>

        <Link
          href="/calculator/sip"
          className="block rounded-3xl bg-[#242424] border border-[#2E2E2E] p-8 hover:border-[#FF6B00]/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.15)] transition-all group"
        >
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
              🧮
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Financial Calculators</h2>
              <p className="text-sm text-[#888888] leading-relaxed">
                SIP, EMI, FD, CAGR, Retirement Planning, Tax Savings, and Loan vs Invest calculators.
              </p>
              <span className="inline-block mt-3 text-sm font-semibold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                Open Calculators →
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/budget"
          className="block rounded-3xl bg-[#242424] border border-[#2E2E2E] p-8 hover:border-[#FF6B00]/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.15)] transition-all group"
        >
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
              💰
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Budget Tracker</h2>
              <p className="text-sm text-[#888888] leading-relaxed">
                Track monthly spending, set category budgets, view analytics and reports.
              </p>
              <span className="inline-block mt-3 text-sm font-semibold text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                Open Budget Tracker →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
