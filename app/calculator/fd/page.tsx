"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull, formatINR } from "@/lib/formatter";
import { fdMaturity, rdMaturity } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { InputSlider } from "@/components/calculator/InputSlider";
import { ResultCard } from "@/components/calculator/ResultCard";
import { InsightCard } from "@/components/calculator/InsightCard";
import { CalcChart } from "@/components/calculator/CalcChart";
import { ResetCopyBar } from "@/components/calculator/ResetCopyBar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalcIcon } from "@/components/shared/CalcIcon";

const defaultInputs = { amount: 100000, rate: 7, years: 3, compounding: "quarterly", isRD: false };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const compounding = String(inputs.compounding || "quarterly");
  const isRD = Boolean(inputs.isRD);
  let maturity: number;
  if (isRD) {
    maturity = rdMaturity(amount, rate, years);
  } else {
    maturity = fdMaturity(amount, rate, years, compounding);
  }
  const returns = Math.max(0, maturity - amount);
  return { maturity: Math.round(maturity), invested: Math.round(isRD ? amount * years * 12 : amount), returns: Math.round(returns), amount: Math.round(amount) };
}

export default function FDPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("fd", defaultInputs, calcFn);

  const r = result as ReturnType<typeof calcFn> | null;
  const isRD = Boolean(inputs.isRD);

  const chartConfig = r ? {
    type: "doughnut" as const,
    data: {
      labels: ["Principal", "Interest Earned"],
      datasets: [{
        label: "Breakdown",
        data: [r.invested, r.returns],
        backgroundColor: ["#6b7280", "#4ade80"],
        borderColor: ["#6b7280", "#4ade80"],
      }]
    }
  } : null;

  const insights = r ? generateInsights("fd", r, inputs) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold flex items-center gap-2"><CalcIcon name="🏛️" className="w-5 h-5" /> FD &amp; RD Calculator</h2>
        <p className="text-sm text-muted-foreground">Safe and steady growth — calculate your deposit returns</p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Fixed Deposit</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Recurring Deposit</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Safe Investment</span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl border bg-card">
        <Switch id="fd-rd-toggle" checked={isRD} onCheckedChange={(v) => updateInput("isRD", v)} />
        <Label htmlFor="fd-rd-toggle" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
          <CalcIcon name="🔁" className="w-4 h-4" />
          {isRD ? "RD Mode — Monthly Deposits" : "FD Mode — Lump Sum Deposit"}
        </Label>
      </div>

      <div className="space-y-5">
        <InputSlider
          id="fd-amount"
          label={isRD ? "Monthly Deposit" : "Deposit Amount"}
          icon="💰"
          value={Number(inputs.amount)}
          min={isRD ? 500 : 1000}
          max={isRD ? 50000 : 10000000}
          step={isRD ? 500 : 1000}
          unit="₹"
          unitPosition="prefix"
          formatValue={(v) => formatINR(v)}
          helperText={isRD ? "Amount you'll deposit every month" : "One-time amount you'll deposit in the bank"}
          helpContent={isRD ? "This is how much you'll put in the RD every month. Regular savings add up!" : "The lump sum amount you'll deposit in a Fixed Deposit."}
          onChange={(v) => updateInput("amount", v)}
        />

        <InputSlider id="fd-rate" label="Interest Rate" icon="📊" value={Number(inputs.rate)} min={0.1} max={15} step={0.25} unit="%" unitPosition="suffix" formatValue={(v) => `${v}%`} helperText="Check your bank's current FD/RD rates" helpContent="Banks offer 6-8% for FDs. Small finance banks may offer slightly higher rates." onChange={(v) => updateInput("rate", v)} />

        <InputSlider id="fd-years" label="Duration" icon="📅" value={Number(inputs.years)} min={1} max={10} step={1} unit="yr" unitPosition="suffix" formatValue={(v) => `${v} years`} helperText="How long will you keep the deposit?" helpContent="Longer tenure usually gets you higher interest rates. Most FDs range from 1-5 years." onChange={(v) => updateInput("years", v)} />

        {!isRD && (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <CalcIcon name="🔄" className="w-4 h-4" />
              Compounding Frequency
            </Label>
            <Select value={String(inputs.compounding)} onValueChange={(v) => updateInput("compounding", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly (Most Common)</SelectItem>
                <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="simple">Simple Interest</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground/80">Quarterly compounding is most common in Indian banks</p>
          </div>
        )}
      </div>

      <ResetCopyBar onReset={resetInputs} summaryObj={r ? { Calculator: isRD ? "RD" : "FD", Amount: formatINR(Number(inputs.amount)), Rate: `${inputs.rate}%`, Duration: `${inputs.years} years`, Maturity: formatINRFull(r.maturity), "Interest Earned": formatINRFull(r.returns) } : undefined} />

      {r && (
        <>
          <ResultCard
            heroLabel={isRD ? "Your RD Matures To" : "Your FD Matures To"}
            heroValue={formatINRFull(r.maturity)}
            heroVariant="positive"
            metrics={[
              { label: "Deposited", value: formatINRFull(r.invested) },
              { label: "Interest Earned", value: formatINRFull(r.returns), variant: "positive" },
              { label: "Growth %", value: r.invested > 0 ? `${((r.returns / r.invested) * 100).toFixed(1)}%` : "0%" },
            ]}
            summary={`Your ${isRD ? "RD" : "FD"} of ${formatINRFull(r.invested)} grows to ${formatINRFull(r.maturity)} over ${inputs.years} years — earning ${formatINRFull(r.returns)} in interest.`}
          />

          <InsightCard insights={insights} />

          {chartConfig && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">MATURITY BREAKDOWN</h3>
              <CalcChart config={chartConfig} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
