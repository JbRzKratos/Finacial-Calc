"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/features/finance-calc/utils/formatter";
import { fdMaturity, rdMaturity } from "@/features/finance-calc/utils/math";
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
import { ResultChart } from "@/features/finance-calc/components/results/ResultChart";

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
  const effectiveReturn = amount > 0 ? ((returns / amount) * 100) : 0;
  return {
    maturity: Math.round(maturity),
    invested: Math.round(isRD ? amount * years * 12 : amount),
    returns: Math.round(returns),
    amount: Math.round(amount),
    effectiveReturn,
  };
}

const compoundingOpts = [
  { value: "monthly", label: "MONTHLY" },
  { value: "quarterly", label: "QUARTERLY" },
  { value: "half-yearly", label: "HALF-YEARLY" },
  { value: "yearly", label: "YEARLY" },
];

const simpleOpts = [
  { value: "compound", label: "COMPOUND" },
  { value: "simple", label: "SIMPLE" },
];

const depositOpts = [
  { value: "false", label: "FIXED DEPOSIT" },
  { value: "true", label: "RECURRING DEPOSIT" },
];

export default function FDPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("fd", defaultInputs, calcFn);
  const [segment, setSegment] = useState("my");
  const r = result as ReturnType<typeof calcFn> | null;
  const isRD = Boolean(inputs.isRD);

  const chartConfig = useMemo(() => r ? {
    type: "doughnut" as const,
    data: {
      labels: ["Principal", "Interest Earned"],
      datasets: [{
        label: "Breakdown",
        data: [r.invested, r.returns],
        backgroundColor: ["#FF6B00", "#1A1A1A"],
        borderColor: ["#FF6B00", "#1A1A1A"],
      }]
    },
    options: {
      cutout: "65%",
      plugins: { legend: { position: "bottom" as const } },
    }
  } : null, [r]);

  const insights = r ? generateInsights("fd", r, inputs) : [];

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Deposit Type
          </p>
          <ToggleGroup
            options={depositOpts}
            value={String(Boolean(inputs.isRD))}
            onChange={(v) => updateInput("isRD", v === "true")}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            {isRD ? "Monthly Deposit" : "Deposit Amount"}
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.amount), onChange: (v) => updateInput("amount", parseFloat(v.replace(/[,\s]/g, "")) || 0), label: isRD ? "MONTHLY" : "AMOUNT" },
              { value: Number(inputs.rate), onChange: (v) => updateInput("rate", parseFloat(v) || 0), label: "RATE", suffix: "%" },
              { value: Number(inputs.years), onChange: (v) => updateInput("years", parseFloat(v) || 1), label: "YEARS", suffix: "yr" },
            ]}
            className="mb-5"
          />

          <NeonSlider
            label={isRD ? "MONTHLY DEPOSIT" : "PRINCIPAL AMOUNT"}
            value={Number(inputs.amount)}
            onChange={(v) => updateInput("amount", v)}
            min={1000}
            max={5000000}
            step={1000}
            unit="₹"
            editable
            tickLabels={["1K", "1.25M", "2.5M", "3.75M", "5M"]}
          />

          <NeonSlider
            label="INTEREST RATE"
            value={Number(inputs.rate)}
            onChange={(v) => updateInput("rate", v)}
            min={1}
            max={15}
            step={0.1}
            unit="% P.A."
            tickLabels={["1%", "4%", "7%", "11%", "15%"]}
          />

          <NeonSlider
            label="DURATION"
            value={Number(inputs.years)}
            onChange={(v) => updateInput("years", v)}
            min={1}
            max={10}
            step={1}
            unit="YRS"
            tickLabels={["1 YR", "3 YR", "5 YR", "7 YR", "10 YR"]}
          />

          {!isRD && (
            <>
              <div className="section-divider" />
              <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
                Compounding
              </p>
              <ToggleGroup
                options={compoundingOpts}
                value={String(inputs.compounding || "quarterly")}
                onChange={(v) => updateInput("compounding", v)}
                className="mb-3"
              />
              <ToggleGroup
                options={simpleOpts}
                value={inputs.compounding === "simple" ? "simple" : "compound"}
                onChange={(v) => updateInput("compounding", v === "simple" ? "simple" : "quarterly")}
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
                value={formatINRFull(r.maturity)}
                subtitle={"Maturity value of your " + (isRD ? "RD" : "FD")}
              />

              <SegmentedResult
                segments={[
                  { value: "my", label: "MY FD" },
                  { value: "inflation", label: "INFLATION ADJ" },
                  { value: "best", label: "BEST RATES" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <div className="mt-1">
                <MetricRow label="Principal Deposited" value={formatINRFull(r.invested)} index={0} />
                <MetricRow label="Interest Earned" value={formatINRFull(r.returns)} variant="positive" index={1} />
                <MetricRow label="Effective Return" value={r.effectiveReturn.toFixed(2) + "%"} index={2} />
                <MetricRow label="Maturity Value" value={formatINRFull(r.maturity)} variant="accent" index={3} />
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
