"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/features/finance-calc/utils/formatter";
import { loanVsInvest, sipFV } from "@/features/finance-calc/utils/math";
import { generateInsights } from "@/features/finance-calc/utils/insights";
import { SplitShell } from "@/features/finance-calc/components/layout/SplitShell";
import { InputRow } from "@/features/finance-calc/components/inputs/InputRow";
import { NeonSlider } from "@/features/finance-calc/components/inputs/NeonSlider";
import { ToggleGroup } from "@/features/finance-calc/components/inputs/ToggleGroup";
import { ActionButtonRow } from "@/features/finance-calc/components/inputs/ActionButtonRow";
import { ResultHero } from "@/features/finance-calc/components/results/ResultHero";
import { MetricRow } from "@/features/finance-calc/components/results/MetricRow";
import { InsightBanner } from "@/features/finance-calc/components/results/InsightBanner";
import { SegmentedResult } from "@/features/finance-calc/components/results/SegmentedResult";
import { WinnerBanner } from "@/features/finance-calc/components/results/WinnerBanner";

const defaultInputs = { mode: "lump", amount: 1000000, years: 10, loanRate: 9, investRate: 12 };

const modeOpts = [
  { value: "lump", label: "LUMP SUM" },
  { value: "sip", label: "MONTHLY SIP" },
];

function calcFn(inputs: Record<string, unknown>) {
  const mode = String(inputs.mode || "lump");
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const loanRate = Math.max(0, Number(inputs.loanRate) || 0);
  const investRate = Math.max(0, Number(inputs.investRate) || 0);
  const res = loanVsInvest(amount, loanRate, investRate, years, mode);
  return {
    investFV: res.finalInvestValue,
    loanSaved: res.totalInterest,
    netDifference: res.netDifference,
    totalInterest: res.totalInterest,
  };
}

export default function LoanVsInvestPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("loanVsInvest", defaultInputs, calcFn);
  const [segment, setSegment] = useState("overview");
  const r = result as ReturnType<typeof calcFn> | null;

  const insights = r ? generateInsights("loanVsInvest", r, inputs) : [];

  const betterOption = r && r.netDifference > 0 ? "Investing" : r && r.netDifference < 0 ? "Loan Repayment" : "Same";
  const winnerLabel = r && r.netDifference > 0 ? "INVEST WINS" : "LOAN REPAY WINS";

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Investment Mode
          </p>
          <ToggleGroup
            options={modeOpts}
            value={String(inputs.mode || "lump")}
            onChange={(v) => updateInput("mode", v)}
            className="mb-3"
          />
          <p className="text-[11px] text-white/70 mb-5">
            {inputs.mode === "lump"
              ? "Compare a lump sum investment vs loan prepayment"
              : "Compare monthly SIP investment vs extra loan payment"}
          </p>

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Amount
          </p>
          <InputRow
            fields={[
              {
                value: Number(inputs.amount),
                onChange: (v) => updateInput("amount", parseFloat(v.replace(/[,\s]/g, "")) || 0),
                label: inputs.mode === "lump" ? "LUMP SUM AMOUNT" : "MONTHLY AMOUNT",
              },
              {
                value: Number(inputs.years),
                onChange: (v) => updateInput("years", parseFloat(v) || 1),
                label: "DURATION",
                suffix: "yr",
              },
            ]}
            className="mb-5"
          />

          <NeonSlider
            label="LOAN INTEREST RATE"
            value={Number(inputs.loanRate)}
            onChange={(v) => updateInput("loanRate", v)}
            min={1}
            max={20}
            step={0.5}
            unit="% P.A."
            tickLabels={["1%", "6%", "10%", "15%", "20%"]}
          />

          <NeonSlider
            label="EXPECTED INVESTMENT RETURN"
            value={Number(inputs.investRate)}
            onChange={(v) => updateInput("investRate", v)}
            min={1}
            max={20}
            step={0.5}
            unit="% P.A."
            tickLabels={["1%", "6%", "10%", "15%", "20%"]}
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
              <ResultHero
                value={betterOption + " Wins"}
                subtitle={"Net difference: " + formatINRFull(Math.abs(r.netDifference))}
                variant={r.netDifference >= 0 ? "positive" : "negative"}
              />

              <WinnerBanner
                investLabel={formatINRFull(r.investFV)}
                loanLabel={formatINRFull(r.loanSaved)}
                winner={winnerLabel}
                investHeader="INVESTMENT VALUE"
                loanHeader="LOAN SAVED"
                className="mt-5"
              />

              <SegmentedResult
                segments={[
                  { value: "overview", label: "OVERVIEW" },
                  { value: "breakdown", label: "BREAKDOWN" },
                  { value: "compare", label: "COMPARE" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <div className="mt-1">
                <MetricRow label="Invest Future Value" value={formatINRFull(r.investFV)} variant="positive" index={0} />
                <MetricRow label="Loan Interest Saved" value={formatINRFull(r.loanSaved)} variant="positive" index={1} />
                <MetricRow label="Net Difference" value={formatINRFull(Math.abs(r.netDifference))} variant={r.netDifference >= 0 ? "positive" : "negative"} index={2} />
                <MetricRow label="Total Loan Interest" value={formatINRFull(r.totalInterest)} variant="negative" index={3} />
              </div>

              {insights.length > 0 && (
                <InsightBanner title={insights[0].title} body={insights[0].description} />
              )}
            </>
          )}
        </>
      }
    />
  );
}
