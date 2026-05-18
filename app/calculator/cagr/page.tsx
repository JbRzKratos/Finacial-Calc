"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull, formatINR } from "@/lib/formatter";
import { cagr, ruleOf72 } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { InputSlider } from "@/components/calculator/InputSlider";
import { ResultCard } from "@/components/calculator/ResultCard";
import { InsightCard } from "@/components/calculator/InsightCard";
import { CalcChart } from "@/components/calculator/CalcChart";
import { ResetCopyBar } from "@/components/calculator/ResetCopyBar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalcIcon } from "@/components/shared/CalcIcon";

const defaultInputs = { initial: 100000, final: 200000, years: 5 };

function calcFn(inputs: Record<string, unknown>) {
  const initial = Math.max(1, Number(inputs.initial) || 1);
  const final = Math.max(0, Number(inputs.final) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const cagrVal = cagr(initial, final, years);
  const returns = final - initial;
  return { cagr: cagrVal, initial: Math.round(initial), final: Math.round(final), returns: Math.round(returns) };
}

export default function CAGRPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("cagr", defaultInputs, calcFn);

  const r = result as ReturnType<typeof calcFn> | null;

  const chartConfig = r ? {
    type: "line" as const,
    data: {
      labels: Array.from({ length: Number(inputs.years) + 1 }, (_, i) => `Y${i}`),
      datasets: [{
        label: "Investment Value",
        data: Array.from({ length: Number(inputs.years) + 1 }, (_, i) => Math.round(r.initial * Math.pow(1 + r.cagr / 100, i))),
        borderColor: "#818cf8",
        backgroundColor: "rgba(129,140,248,0.1)",
        fill: true,
      }]
    }
  } : null;

  const insights = r ? generateInsights("cagr", r, inputs) : [];

  const cagrVal = r?.cagr ?? 0;
  const badgeVariant = cagrVal >= 12 ? "default" as const : cagrVal >= 7 ? "secondary" as const : "destructive" as const;
  const badgeText = cagrVal >= 12 ? "Excellent Growth" : cagrVal >= 7 ? "Good Growth" : cagrVal > 0 ? "Below Average" : "Loss of Funds";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold flex items-center gap-2"><CalcIcon name="📊" className="w-5 h-5" /> CAGR Calculator</h2>
        <p className="text-sm text-muted-foreground">Measure how fast your investment grew per year</p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Investment Performance</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Annualized Return</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Compare Investments</span>
        </div>
      </div>

      <Card className="p-4 text-sm text-muted-foreground leading-relaxed">
        CAGR = <strong>Compound Annual Growth Rate</strong>. It tells you the average yearly return of your investment. Enter your starting value, ending value, and time period below.
      </Card>

      <div className="space-y-5">
        <InputSlider id="cagr-initial" label="Initial Investment" icon="💵" value={Number(inputs.initial)} min={1000} max={10000000} step={1000} unit="₹" unitPosition="prefix" formatValue={(v) => formatINR(v)} helperText="What did you originally invest?" onChange={(v) => updateInput("initial", v)} />

        <InputSlider id="cagr-final" label="Final Value" icon="💰" value={Number(inputs.final)} min={0} max={100000000} step={1000} unit="₹" unitPosition="prefix" formatValue={(v) => formatINR(v)} helperText="What is it worth today?" onChange={(v) => updateInput("final", v)} />

        <InputSlider id="cagr-years" label="Time Period" icon="📅" value={Number(inputs.years)} min={1} max={50} step={1} unit="yr" unitPosition="suffix" formatValue={(v) => `${v} years`} helperText="How many years since you invested?" onChange={(v) => updateInput("years", v)} />
      </div>

      <ResetCopyBar onReset={resetInputs} summaryObj={r ? { Calculator: "CAGR", "Initial Value": formatINR(Number(inputs.initial)), "Final Value": formatINR(Number(inputs.final)), Period: `${inputs.years} years`, CAGR: `${r.cagr.toFixed(2)}%`, "Total Return": formatINRFull(r.returns) } : undefined} />

      {r && (
        <>
          <ResultCard
            heroLabel="Your CAGR"
            heroValue={`${r.cagr.toFixed(2)}%`}
            heroVariant={r.cagr >= 0 ? "positive" : "negative"}
            metrics={[
              { label: "Initial", value: formatINRFull(r.initial) },
              { label: "Final", value: formatINRFull(r.final) },
              { label: "Total Return", value: formatINRFull(r.returns), variant: r.returns >= 0 ? "positive" : "negative" },
            ]}
            summary={`Your investment grew from ${formatINRFull(r.initial)} to ${formatINRFull(r.final)} in ${inputs.years} years — that's ${r.cagr.toFixed(2)}% per year.`}
          />

          <Badge variant={badgeVariant} className="text-sm py-1 px-3 inline-flex items-center gap-1">
            <CalcIcon name={cagrVal >= 12 ? "🚀" : cagrVal > 0 ? "📈" : "⚠️"} className="w-4 h-4" />
            {badgeText}
          </Badge>

          <InsightCard insights={insights} />

          {chartConfig && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">GROWTH OVER TIME</h3>
              <CalcChart config={chartConfig} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
