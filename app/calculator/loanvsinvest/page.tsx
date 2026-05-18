"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull, formatINR } from "@/lib/formatter";
import { loanVsInvest } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { InputSlider } from "@/components/calculator/InputSlider";
import { InsightCard } from "@/components/calculator/InsightCard";
import { CalcChart } from "@/components/calculator/CalcChart";
import { ResetCopyBar } from "@/components/calculator/ResetCopyBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalcIcon } from "@/components/shared/CalcIcon";

const defaultInputs = { amount: 1000000, loanRate: 10, investRate: 12, years: 10 };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const loanRate = Math.max(0, Number(inputs.loanRate) || 0);
  const investRate = Math.max(0, Number(inputs.investRate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  return loanVsInvest(amount, loanRate, investRate, years);
}

export default function LoanVsInvestPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("loanvsinvest", defaultInputs, calcFn);

  const r = result as ReturnType<typeof calcFn> | null;

  const chartConfig = r ? {
    type: "line" as const,
    data: {
      labels: r.rows.map((row: { year: number }) => `Y${row.year}`),
      datasets: [
        {
          label: "Net Worth (Invest)",
          data: r.rows.map((row: { investValue: number }) => row.investValue),
          borderColor: "#818cf8",
          backgroundColor: "rgba(129,140,248,0.1)",
          fill: true,
        },
        {
          label: "Total Paid",
          data: r.rows.map((row: { totalPaid: number }) => row.totalPaid),
          borderColor: "#f87171",
          borderDash: [6, 3],
          fill: false,
        }
      ]
    }
  } : null;

  const insights = r ? generateInsights("loanvsinvest", r, inputs) : [];

  const diff = r?.netDifference ?? 0;
  const investingWins = diff >= 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold flex items-center gap-2"><CalcIcon name="⚖️" className="w-5 h-5" /> Loan vs Invest</h2>
        <p className="text-sm text-muted-foreground">Should you repay debt or invest? Let's find out.</p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Debt vs Investment</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Opportunity Cost</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Smart Decision</span>
        </div>
      </div>

      <Card className="p-4 text-sm text-muted-foreground leading-relaxed">
        You have <strong>{formatINRFull(Number(inputs.amount))}</strong>. Should you pay off your loan faster OR invest that money? We'll calculate which gives you more in the end.
      </Card>

      <div className="space-y-5">
        <InputSlider id="lvi-amount" label="Loan / Investment Amount" icon="💰" value={Number(inputs.amount)} min={10000} max={10000000} step={10000} unit="₹" unitPosition="prefix" formatValue={(v) => formatINR(v)} helperText="Total amount you're deciding about" onChange={(v) => updateInput("amount", v)} />

        <InputSlider id="lvi-loanRate" label="Loan Interest Rate" icon="📊" value={Number(inputs.loanRate)} min={0.1} max={50} step={0.25} unit="%" unitPosition="suffix" formatValue={(v) => `${v}%`} helperText="Your current loan's interest rate" onChange={(v) => updateInput("loanRate", v)} />

        <InputSlider id="lvi-investRate" label="Investment Return Rate" icon="📈" value={Number(inputs.investRate)} min={0.1} max={50} step={0.25} unit="%" unitPosition="suffix" formatValue={(v) => `${v}%`} helperText="Expected return if you invest instead" onChange={(v) => updateInput("investRate", v)} />

        <InputSlider id="lvi-years" label="Duration" icon="📅" value={Number(inputs.years)} min={1} max={50} step={1} unit="yr" unitPosition="suffix" formatValue={(v) => `${v} years`} helperText="Over how many years?" onChange={(v) => updateInput("years", v)} />
      </div>

      <ResetCopyBar onReset={resetInputs} summaryObj={r ? { Calculator: "Loan vs Invest", Amount: formatINR(Number(inputs.amount)), "Loan Rate": `${inputs.loanRate}%`, "Invest Return": `${inputs.investRate}%`, Duration: `${inputs.years} years`, "Final Invest Value": formatINRFull(r.finalInvestValue), "Total Interest": formatINRFull(r.totalInterest), Difference: formatINRFull(Math.abs(r.netDifference)) + (investingWins ? " (Invest wins)" : " (Repay wins)") } : undefined} />

      {r && (
        <>
          <Card className={`p-6 ${investingWins ? "bg-calc-positive-bg border-calc-positive" : "bg-calc-negative-bg border-calc-negative"}`}>
            <div className="flex items-center gap-3">
              <CalcIcon name={investingWins ? "🏆" : "✅"} className="w-8 h-8" />
              <div>
                <p className="text-lg font-bold">{investingWins ? "INVESTING WINS" : "REPAYING WINS"} by {formatINRFull(Math.abs(diff))}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {investingWins
                    ? `Investing gives you ${formatINRFull(Math.abs(diff))} more than repaying the loan.`
                    : `Repaying saves you ${formatINRFull(Math.abs(diff))} more than investing.`
                  }
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center space-y-1">
              <p className="text-[11px] text-muted-foreground">If you REPAY</p>
              <p className="text-base font-semibold text-calc-negative">{formatINRFull(r.totalInterest)}</p>
              <p className="text-[11px] text-muted-foreground">saved in interest</p>
            </Card>
            <Card className="p-4 text-center space-y-1">
              <p className="text-[11px] text-muted-foreground">If you INVEST</p>
              <p className="text-base font-semibold text-calc-positive">{formatINRFull(r.finalInvestValue)}</p>
              <p className="text-[11px] text-muted-foreground">earned in returns</p>
            </Card>
          </div>

          <InsightCard insights={insights} />

          {chartConfig && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">NET WORTH COMPARISON</h3>
              <CalcChart config={chartConfig} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
