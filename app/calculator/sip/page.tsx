"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull, formatINR } from "@/lib/formatter";
import { sipFV, sipYearlyBreakdown, ruleOf72 } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { InputSlider } from "@/components/calculator/InputSlider";
import { ResultCard } from "@/components/calculator/ResultCard";
import { InsightCard } from "@/components/calculator/InsightCard";
import { BreakdownTable } from "@/components/calculator/BreakdownTable";
import { CalcChart } from "@/components/calculator/CalcChart";
import { ResetCopyBar } from "@/components/calculator/ResetCopyBar";
import { CalcIcon } from "@/components/shared/CalcIcon";

const defaultInputs = { amount: 5000, years: 10, rate: 12 };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const months = years * 12;
  const maturity = sipFV(amount, months, rate);
  const invested = amount * months;
  const returns = Math.max(0, maturity - invested);
  const breakdown = sipYearlyBreakdown(amount, years, rate);
  const doubleYears = rate > 0 ? Math.round(ruleOf72(rate)) : 0;
  return { maturity: Math.round(maturity), invested: Math.round(invested), returns: Math.round(returns), doubleYears, breakdown };
}

export default function SIPPage() {
  const { inputs, result, updateInput, resetInputs, calculate } = useCalculator("sip", defaultInputs, calcFn);

  const r = result as ReturnType<typeof calcFn> | null;
  const chartConfig = r ? {
    type: "doughnut" as const,
    data: {
      labels: ["Principal Invested", "Est. Returns"],
      datasets: [{
        label: "Breakdown",
        data: [r.invested, r.returns],
        backgroundColor: ["#6b7280", "#818cf8"],
        borderColor: ["#6b7280", "#818cf8"],
      }]
    }
  } : null;

  const breakdownData = r ? {
    headers: ["Year", "Invested", "Returns", "Corpus"],
    rows: r.breakdown.map((row: { year: number; invested: number; returns: number; corpus: number }) => [
      `Year ${row.year}`, formatINRFull(row.invested), formatINRFull(row.returns), formatINRFull(row.corpus)
    ])
  } : { headers: [], rows: [] };

  const insights = r ? generateInsights("sip", r, inputs) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CalcIcon name="💰" className="w-5 h-5" /> SIP Calculator
        </h2>
        <p className="text-sm text-muted-foreground">Find out how much your monthly savings will grow</p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Monthly Savings</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Long-term Growth</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Mutual Funds</span>
        </div>
      </div>

      <div className="space-y-5">
        <InputSlider id="sip-amount" label="Monthly Investment" icon="💵" value={Number(inputs.amount)} min={500} max={100000} step={500} unit="₹" unitPosition="prefix" formatValue={(v) => formatINR(v)} helperText="Start with at least ₹1,000/month" helpContent="This is how much you can save and invest each month. Even small amounts add up over time!" onChange={(v) => updateInput("amount", v)} />

        <InputSlider id="sip-years" label="Investment Duration" icon="📅" value={Number(inputs.years)} min={1} max={40} step={1} unit="yr" unitPosition="suffix" formatValue={(v) => `${v} years`} helperText="Stay invested for at least 5-7 years for best results" helpContent="The longer you stay invested, the more your money compounds. 10+ years is ideal for equity investments." onChange={(v) => updateInput("years", v)} />

        <InputSlider id="sip-rate" label="Expected Annual Return" icon="📈" value={Number(inputs.rate)} min={1} max={30} step={0.25} unit="%" unitPosition="suffix" formatValue={(v) => `${v}%`} helperText="Equity MFs avg 12%, FDs give ~7%. Be realistic!" helpContent="This is how much your investment grows each year. Equity mutual funds historically give 12-15%. FDs give around 6-7%." onChange={(v) => updateInput("rate", v)} />
      </div>

      <div className="flex gap-2">
        <ResetCopyBar onReset={resetInputs} summaryObj={r ? { Calculator: "SIP", Amount: formatINR(Number(inputs.amount)), Duration: `${inputs.years} years`, "Expected Return": `${inputs.rate}%`, Maturity: formatINRFull(r.maturity), Invested: formatINRFull(r.invested), Returns: formatINRFull(r.returns) } : undefined} />
      </div>

      {r && (
        <>
          <ResultCard
            heroLabel="Your Maturity Amount"
            heroValue={formatINRFull(r.maturity)}
            heroVariant="accent"
            metrics={[
              { label: "Invested", value: formatINRFull(r.invested) },
              { label: "Returns", value: formatINRFull(r.returns), variant: "positive" },
              { label: "Growth", value: r.invested > 0 ? `${((r.returns / r.invested) * 100).toFixed(1)}%` : "0%", variant: "accent" },
            ]}
            summary={`You invest ${formatINRFull(r.invested)} and get back ${formatINRFull(r.maturity)} — your money grows by ${((r.returns / r.invested) * 100).toFixed(0)}%. ${r.doubleYears > 0 ? `Your money doubles every ~${r.doubleYears} years.` : ''}`}
          />

          <InsightCard insights={insights} />

          {chartConfig && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">PORTFOLIO BREAKDOWN</h3>
              <CalcChart config={chartConfig} />
            </div>
          )}

          <div className="p-4 rounded-xl border bg-card">
            <BreakdownTable data={breakdownData} />
          </div>
        </>
      )}
    </div>
  );
}
