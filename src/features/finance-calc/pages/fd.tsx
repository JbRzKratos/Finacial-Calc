"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINRFull } from "@/features/finance-calc/utils/formatter";
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
import { Card, CardContent } from "@/components/ui/card";

const defaultInputs = {
  depositType: "fd",
  amount: 100000,
  rate: 7.5,
  years: 3,
  compounding: "quarterly",
};

function calcFn(inputs: Record<string, unknown>) {
  const depositType = String(inputs.depositType || "fd");
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const compounding = String(inputs.compounding || "quarterly");

  let maturity: number;
  if (depositType === "rd") {
    maturity = rdMaturity(amount, rate, years);
  } else {
    maturity = fdMaturity(amount, rate, years, compounding);
  }
  const totalInterest = maturity - amount;
  return {
    maturity: Math.round(maturity),
    totalInterest: Math.round(totalInterest),
    amount: Math.round(amount),
    depositType,
    returnsPct: amount > 0 ? (totalInterest / amount) * 100 : 0,
  };
}

const compoundingOptions = [
  { value: "simple", label: "SIMPLE" },
  { value: "yearly", label: "YEARLY" },
  { value: "half-yearly", label: "HALF-YR" },
  { value: "quarterly", label: "QUARTER" },
  { value: "monthly", label: "MONTHLY" },
];

export default function FDPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("fd", defaultInputs, calcFn);
  const [segment, setSegment] = useState("total");
  const r = result as ReturnType<typeof calcFn> | null;

  const insights = r ? generateInsights("fd", r, inputs) : [];

  const heroValue = segment === "total" ? formatINRFull(r?.maturity ?? 0)
    : segment === "interest" ? formatINRFull(r?.totalInterest ?? 0)
    : formatINRFull(r?.amount ?? 0);

  const heroSub = segment === "total" ? "Maturity amount"
    : segment === "interest" ? "Total interest earned"
    : "Principal invested";

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Deposit Type
          </p>
          <ToggleGroup
            options={[
              { value: "fd", label: "FIXED DEPOSIT" },
              { value: "rd", label: "RECURRING DEPOSIT" },
            ]}
            value={String(inputs.depositType || "fd")}
            onChange={(v) => updateInput("depositType", v)}
            className="mb-5"
          />

          <div className="section-divider" />
          {String(inputs.depositType) === "rd" ? (
            <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
              Monthly Deposit
            </p>
          ) : (
            <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
              Principal Amount
            </p>
          )}
          <InputRow
            fields={[{
              value: Number(inputs.amount),
              onChange: (v) => updateInput("amount", parseFloat(v.replace(/[,\s]/g, "")) || 0),
              label: String(inputs.depositType) === "rd" ? "MONTHLY" : "AMOUNT",
            }]}
            className="mb-5"
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
            max={30}
            step={1}
            unit="YRS"
            tickLabels={["1 YR", "8 YR", "15 YR", "22 YR", "30 YR"]}
          />

          {String(inputs.depositType) === "fd" && (
            <>
              <div className="section-divider" />
              <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
                Compounding Frequency
              </p>
              <ToggleGroup
                options={compoundingOptions}
                value={String(inputs.compounding || "quarterly")}
                onChange={(v) => updateInput("compounding", v)}
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
              <ResultHero value={heroValue} subtitle={heroSub} />

              <SegmentedResult
                segments={[
                  { value: "total", label: "MATURITY" },
                  { value: "interest", label: "INTEREST" },
                  { value: "principal", label: "PRINCIPAL" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <Card className="bg-card border-border mt-4">
                <CardContent className="p-4 flex flex-col gap-1">
                  <MetricRow label="Principal" value={formatINRFull(r.amount)} index={0} />
                  <MetricRow label="Total Interest" value={formatINRFull(r.totalInterest)} variant="positive" index={1} />
                  <MetricRow label="Maturity Amount" value={formatINRFull(r.maturity)} variant="accent" index={2} />
                  <MetricRow label="Returns" value={r.returnsPct.toFixed(1) + "%"} index={3} />
                </CardContent>
              </Card>

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
