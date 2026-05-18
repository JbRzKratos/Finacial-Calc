"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/lib/formatter";
import { loanVsInvest } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { SplitShell } from "@/components/layout/SplitShell";
import { InputRow } from "@/components/ui-custom/InputRow";
import { ToggleGroup } from "@/components/ui-custom/ToggleGroup";
import { ActionButtonRow } from "@/components/ui-custom/ActionButtonRow";
import { ResultHero } from "@/components/ui-custom/ResultHero";
import { MetricRow } from "@/components/ui-custom/MetricRow";
import { InsightBanner } from "@/components/ui-custom/InsightBanner";
import { SegmentedResult } from "@/components/ui-custom/SegmentedResult";
import { ResultChart } from "@/components/ui-custom/ResultChart";
import { WinnerBanner } from "@/components/ui-custom/WinnerBanner";

const defaultInputs = { amount: 1000000, loanRate: 10, investRate: 12, years: 10, mode: "lump" };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const loanRate = Math.max(0, Number(inputs.loanRate) || 0);
  const investRate = Math.max(0, Number(inputs.investRate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const mode = String(inputs.mode || "lump");
  return loanVsInvest(amount, loanRate, investRate, years, mode);
}

export default function LoanVsInvestPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("loanvsinvest", defaultInputs, calcFn);
  const [segment, setSegment] = useState("compare");
  const r = result as ReturnType<typeof calcFn> | null;

  const chartConfig = useMemo(() => r ? {
    type: "line" as const,
    data: {
      labels: r.rows.map((row: { year: number }) => `Y${row.year}`),
      datasets: [
        {
          label: "Net Benefit (Invest)",
          data: r.rows.map((row: { investValue: number; totalPaid: number }) => row.investValue - row.totalPaid),
          borderColor: "#FF6B00",
          backgroundColor: "rgba(255,107,0,0.08)",
          fill: true,
        },
        {
          label: "Investment Growth",
          data: r.rows.map((row: { investValue: number }) => row.investValue),
          borderColor: "#FF6B00",
          borderDash: [4, 4] as [number, number],
          fill: false,
        },
        {
          label: "Loan Cost",
          data: r.rows.map((row: { totalPaid: number }) => row.totalPaid),
          borderColor: "#1A1A1A",
          borderDash: [4, 4] as [number, number],
          fill: false,
        },
      ]
    },
    options: {
      plugins: { legend: { position: "bottom" as const } },
    }
  } : null, [r]);

  const insights = r ? generateInsights("loanvsinvest", r, inputs) : [];

  const diff = r?.netDifference ?? 0;
  const investingWins = diff >= 0;

  return (
    <SplitShell
      left={
        <>
          <p className="text-[11px] font-medium text-white/50 uppercase tracking-[0.08em] mb-3">
            FinCalc Pro <span className="text-white/30">›</span>{" "}
            <span className="text-white/90 font-bold">Loan vs Invest</span>
          </p>
          <p className="text-[clamp(16px,2.5vw,20px)] font-bold text-white/95 tracking-[-0.01em] mb-1">
            Loan vs Invest
          </p>
          <p className="text-[12px] font-medium text-white/70 mb-5">
            Find what works better for you
          </p>

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            The Amount
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.amount),
              onChange: (v) => updateInput("amount", parseFloat(v.replace(/[₹,\s]/g, "")) || 0),
              label: "AMOUNT IN QUESTION",
            }]}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Loan Details
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.loanRate), onChange: (v) => updateInput("loanRate", parseFloat(v) || 0), label: "LOAN INTEREST", suffix: "%" },
              { value: Number(inputs.years), onChange: (v) => updateInput("years", parseFloat(v) || 1), label: "LOAN TENURE", suffix: "yr" },
            ]}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Investment Details
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.investRate),
              onChange: (v) => updateInput("investRate", parseFloat(v) || 0),
              label: "EXPECTED RETURN",
              suffix: "%",
            }]}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Investment Mode
          </p>
          <ToggleGroup
            options={[
              { value: "lump", label: "LUMP SUM" },
              { value: "sip", label: "MONTHLY SIP" },
            ]}
            value={String(inputs.mode || "lump")}
            onChange={(v) => updateInput("mode", v)}
          />

          <ActionButtonRow onClear={resetInputs} />
        </>
      }
      right={
        <>
          {!r ? (
            <ResultHero value="" subtitle="" showEmptyState />
          ) : (
            <>
              {r && (
                <WinnerBanner
                  winner={investingWins ? "invest" : "repay"}
                  amount={formatINRFull(Math.abs(diff))}
                />
              )}

              <SegmentedResult
                segments={[
                  { value: "compare", label: "COMPARE" },
                  { value: "repay", label: "REPAY" },
                  { value: "invest", label: "INVEST" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <div className="mt-1">
                <MetricRow label="Interest Saved (Repay)" value={formatINRFull(r?.totalInterest ?? 0)} variant="positive" index={0} />
                <MetricRow label="Final Corpus (Invest)" value={formatINRFull(r?.finalInvestValue ?? 0)} variant="accent" index={1} />
                <MetricRow label="Net Advantage" value={formatINRFull(Math.abs(diff))} variant={investingWins ? "accent" : "positive"} index={2} />
              </div>

              {insights.length > 0 && (
                <InsightBanner title={insights[0].title} body={insights[0].description} />
              )}

              {chartConfig && (
                <div className="mt-6">
                  <ResultChart config={chartConfig} height={240} />
                </div>
              )}
            </>
          )}
        </>
      }
    />
  );
}
