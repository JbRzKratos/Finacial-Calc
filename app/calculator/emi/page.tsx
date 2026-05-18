"use client";

import { useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull, formatINR } from "@/lib/formatter";
import { emi, emiBreakdown } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { InputSlider } from "@/components/calculator/InputSlider";
import { ResultCard } from "@/components/calculator/ResultCard";
import { InsightCard } from "@/components/calculator/InsightCard";
import { BreakdownTable } from "@/components/calculator/BreakdownTable";
import { CalcChart } from "@/components/calculator/CalcChart";
import { ResetCopyBar } from "@/components/calculator/ResetCopyBar";
import { CalcIcon } from "@/components/shared/CalcIcon";
import { cn } from "@/lib/utils";

const loanPresets = [
  { id: "home", label: "Home Loan", amount: 5000000, rate: 8.5, years: 20 },
  { id: "car", label: "Car Loan", amount: 800000, rate: 9, years: 5 },
  { id: "edu", label: "Edu Loan", amount: 1000000, rate: 8, years: 10 },
  { id: "other", label: "Other", amount: 500000, rate: 12, years: 3 },
];

const defaultInputs = { amount: 5000000, rate: 8.5, years: 20 };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const months = years * 12;
  const emiAmt = emi(amount, rate, months);
  const totalPayment = emiAmt * months;
  const totalInterest = totalPayment - amount;
  const breakdown = emiBreakdown(amount, rate, months);
  return { emi: Math.round(emiAmt), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest), amount: Math.round(amount), months, breakdown };
}

export default function EMIPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("emi", defaultInputs, calcFn);
  const [showPresets, setShowPresets] = useState(true);

  const r = result as ReturnType<typeof calcFn> | null;
  const chartConfig = r ? {
    type: "bar" as const,
    data: {
      labels: r.breakdown.map((b: { year: number }) => `Y${b.year}`),
      datasets: [
        { label: "Principal Paid", data: r.breakdown.map((b: { principalPaid: number }) => b.principalPaid), backgroundColor: "#818cf8" },
        { label: "Interest Paid", data: r.breakdown.map((b: { interestPaid: number }) => b.interestPaid), backgroundColor: "#f87171" },
      ]
    }
  } : null;

  const breakdownData = r ? {
    headers: ["Year", "EMI Paid", "Principal", "Interest", "Balance"],
    rows: r.breakdown.map((b: { year: number; emi: number; principalPaid: number; interestPaid: number; balance: number }) => [
      `Year ${b.year}`, formatINRFull(b.emi), formatINRFull(b.principalPaid), formatINRFull(b.interestPaid), formatINRFull(b.balance)
    ])
  } : { headers: [], rows: [] };

  const insights = r ? generateInsights("emi", r, inputs) : [];

  const applyPreset = (preset: typeof loanPresets[0]) => {
    setShowPresets(false);
    updateInput("amount", preset.amount);
    updateInput("rate", preset.rate);
    updateInput("years", preset.years);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold flex items-center gap-2"><CalcIcon name="🏦" className="w-5 h-5" /> EMI Calculator</h2>
        <p className="text-sm text-muted-foreground">Know your exact monthly payment before taking a loan</p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Home Loan</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Car Loan</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Personal Loan</span>
        </div>
      </div>

      {showPresets && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">QUICK SELECT — pick a loan type</p>
          <div className="grid grid-cols-2 gap-2">
            {loanPresets.map((preset) => (
              <button key={preset.id} onClick={() => applyPreset(preset)} className="p-3 rounded-xl border bg-card hover:bg-muted/50 transition-colors text-left space-y-1">
                <span className="text-lg block">{preset.label}</span>
                <span className="text-[11px] text-muted-foreground block">Auto-fills typical values</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowPresets(false)} className="text-xs text-muted-foreground hover:text-foreground">Skip, enter manually →</button>
        </div>
      )}

      <div className="space-y-5">
        <InputSlider id="emi-amount" label="Loan Amount" icon="💰" value={Number(inputs.amount)} min={10000} max={10000000} step={10000} unit="₹" unitPosition="prefix" formatValue={(v) => formatINR(v)} helperText="Total amount you want to borrow" helpContent="This is the total loan amount you plan to take from the bank or lender." onChange={(v) => updateInput("amount", v)} />

        <InputSlider id="emi-rate" label="Annual Interest Rate" icon="📊" value={Number(inputs.rate)} min={0.1} max={36} step={0.25} unit="%" unitPosition="suffix" formatValue={(v) => `${v}%`} helperText="Home loans: 8-9%, Personal: 10-15%" helpContent="Check your bank's current interest rate. Home loans are usually 8-9%, personal loans 10-15%, and credit cards can be 30%+." onChange={(v) => updateInput("rate", v)} />

        <InputSlider id="emi-years" label="Loan Tenure" icon="📅" value={Number(inputs.years)} min={1} max={30} step={1} unit="yr" unitPosition="suffix" formatValue={(v) => `${v} years`} helperText="How many years to repay the loan" helpContent="Longer tenure means lower EMI but more total interest. Shorter tenure = higher EMI but less interest overall." onChange={(v) => updateInput("years", v)} />
      </div>

      <ResetCopyBar onReset={resetInputs} summaryObj={r ? { Calculator: "EMI", "Loan Amount": formatINR(Number(inputs.amount)), "Interest Rate": `${inputs.rate}%`, Tenure: `${inputs.years} years`, EMI: formatINRFull(r.emi), "Total Payment": formatINRFull(r.totalPayment), "Total Interest": formatINRFull(r.totalInterest) } : undefined} />

      {r && (
        <>
          <ResultCard
            heroLabel="Your Monthly EMI"
            heroValue={formatINRFull(r.emi)}
            heroVariant="accent"
            metrics={[
              { label: "Total Amount", value: formatINRFull(r.totalPayment) },
              { label: "Total Interest", value: formatINRFull(r.totalInterest), variant: "negative" },
              { label: "Interest %", value: r.totalPayment > 0 ? `${((r.totalInterest / r.totalPayment) * 100).toFixed(1)}%` : "0%", variant: "negative" },
            ]}
            summary={`You pay ${formatINRFull(r.emi)} every month for ${inputs.years} years. Total interest is ${formatINRFull(r.totalInterest)} — ${((r.totalInterest / r.amount) * 100).toFixed(0)}% of your loan amount.`}
          />

          <InsightCard insights={insights} />

          {chartConfig && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">YEARLY BREAKDOWN</h3>
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
