"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/lib/formatter";
import { taxNewRegime, taxOldRegime } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { SplitShell } from "@/components/layout/SplitShell";
import { InputRow } from "@/components/ui-custom/InputRow";
import { ToggleGroup } from "@/components/ui-custom/ToggleGroup";
import { ActionButtonRow } from "@/components/ui-custom/ActionButtonRow";
import { ResultHero } from "@/components/ui-custom/ResultHero";
import { MetricRow } from "@/components/ui-custom/MetricRow";
import { InsightBanner } from "@/components/ui-custom/InsightBanner";
import { SegmentedResult } from "@/components/ui-custom/SegmentedResult";

const defaultInputs = { income: 1000000, deduction80C: 150000, regime: "new" };

function calcFn(inputs: Record<string, unknown>) {
  const income = Math.max(0, Number(inputs.income) || 0);
  const deduction80C = Math.max(0, Number(inputs.deduction80C) || 0);
  const regime = String(inputs.regime || "new");
  const newResult = taxNewRegime(income);
  const oldResult = taxOldRegime(income, deduction80C);
  const current = regime === "new" ? newResult : oldResult;
  const savings = Math.abs(newResult.totalTax - oldResult.totalTax);
  return {
    ...current,
    newTotal: newResult.totalTax,
    oldTotal: oldResult.totalTax,
    savings,
    regime,
    income,
  };
}

const regimeOpts = [
  { value: "new", label: "NEW REGIME" },
  { value: "old", label: "OLD REGIME" },
];

export default function TaxPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("tax", defaultInputs, calcFn);
  const [segment, setSegment] = useState("new");
  const r = result as ReturnType<typeof calcFn> | null;
  const isNewRegime = inputs.regime === "new";

  const insights = r ? generateInsights("tax", r, inputs) : [];

  const betterRegime = r && r.newTotal < r.oldTotal ? "New Regime" : r && r.oldTotal < r.newTotal ? "Old Regime" : "Same";

  const monthlyTax = r ? Math.round(r.totalTax / 12) : 0;
  const monthlyTakehome = r ? Math.round((r.income - r.totalTax) / 12) : 0;

  return (
    <SplitShell
      left={
        <>
          <p className="text-[11px] font-medium text-white/50 uppercase tracking-[0.08em] mb-3">
            FinCalc Pro <span className="text-white/30">›</span>{" "}
            <span className="text-white/90 font-bold">Tax Calculator</span>
          </p>
          <p className="text-[clamp(16px,2.5vw,20px)] font-bold text-white/95 tracking-[-0.01em] mb-1">
            Tax Calculator
          </p>
          <p className="text-[12px] font-medium text-white/70 mb-5">
            FY 2025-26 — Budget 2025
          </p>

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Tax Regime
          </p>
          <ToggleGroup
            options={regimeOpts}
            value={String(inputs.regime || "new")}
            onChange={(v) => updateInput("regime", v)}
            className="mb-3"
          />
          <p className="text-[11px] text-white/70 mb-5">
            {isNewRegime
              ? "Standard deduction ₹75,000. No 80C deductions."
              : "Standard deduction ₹50,000. 80C up to ₹1.5L."}
          </p>

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Income Details
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.income),
              onChange: (v) => updateInput("income", parseFloat(v.replace(/[₹,\s]/g, "")) || 0),
              label: "ANNUAL GROSS INCOME (CTC)",
            }]}
            className="mb-5"
          />

          {!isNewRegime && (
            <>
              <div className="section-divider" />
              <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
                80C Investments
              </p>
              <InputRow
                fields={[{
                  value: Number(inputs.deduction80C),
                  onChange: (v) => updateInput("deduction80C", parseFloat(v.replace(/[₹,\s]/g, "")) || 0),
                  label: "80C INVESTMENTS (MAX ₹1,50,000)",
                }]}
              />
            </>
          )}

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
                value={formatINRFull(r?.totalTax ?? 0)}
                subtitle="Total tax payable this year"
                variant="negative"
              />

              <SegmentedResult
                segments={[
                  { value: "new", label: "NEW REGIME" },
                  { value: "old", label: "OLD REGIME" },
                  { value: "compare", label: "COMPARE" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <div className="mt-1">
                <MetricRow label="Effective Tax Rate" value={`${(r?.effectiveRate ?? 0).toFixed(2)}%`} index={0} />
                <MetricRow label="Monthly Tax Deducted" value={formatINRFull(monthlyTax)} variant="negative" index={1} />
                <MetricRow label="Take-home Monthly" value={formatINRFull(monthlyTakehome)} variant="positive" index={2} />
                <MetricRow label="You Keep (Annual)" value={formatINRFull(r ? r.income - r.totalTax : 0)} variant="positive" index={3} />
              </div>

              {insights.length > 0 && (
                <InsightBanner title={insights[0].title} body={insights[0].description} />
              )}

              <InsightBanner
                title="Regime Comparison"
                body={`New Regime saves you ${formatINRFull(r?.savings ?? 0)} vs Old Regime at your income level. Most salaried employees benefit from New Regime. ${betterRegime !== "Same" ? betterRegime + " is better for you." : ""}`}
              />
            </>
          )}
        </>
      }
    />
  );
}
