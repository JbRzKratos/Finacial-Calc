"use client";

import { useCallback, useMemo, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { emi, emiBreakdown } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { SplitShell } from "@/components/layout/SplitShell";
import { InputRow } from "@/components/common/StepperBox/StepperBox";
import { NeonSlider } from "@/components/common/SliderInput/SliderInput";
import { ActionButtonRow } from "@/components/common/ActionButtonRow/ActionButtonRow";
import { ResultHero } from "@/components/common/ResultHero/ResultHero";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricRow } from "@/components/common/MetricRow/MetricRow";
import { InsightBanner } from "@/components/common/InsightBanner/InsightBanner";
import { SegmentedResult } from "@/components/common/SegmentedResult/SegmentedResult";
import { ResultChart } from "@/components/common/ResultChart/ResultChart";
import { Card, CardContent } from "@/components/ui/card";

const loanPresets = [
  { value: "home", label: "HOME" },
  { value: "car", label: "CAR" },
  { value: "edu", label: "EDUCATION" },
  { value: "other", label: "PERSONAL" },
];

const presetMap: Record<string, { amount: number; rate: number; years: number }> = {
  home: { amount: 5000000, rate: 8.5, years: 20 },
  car: { amount: 800000, rate: 9, years: 5 },
  edu: { amount: 1000000, rate: 8, years: 10 },
  other: { amount: 500000, rate: 12, years: 3 },
};

const defaultInputs = { amount: 5000000, rate: 8.5, years: 20, preset: "home" };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const months = years * 12;
  const emiAmt = emi(amount, rate, months);
  const totalPayment = emiAmt * months;
  const totalInterest = totalPayment - amount;
  const breakdown = emiBreakdown(amount, rate, months);
  return {
    emi: Math.round(emiAmt),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    amount: Math.round(amount),
    months,
    breakdown,
    interestRatio: totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0,
  };
}

export default function EMIPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("emi", defaultInputs, calcFn);
  const [segment, setSegment] = useState("month");
  const r = result as ReturnType<typeof calcFn> | null;

  const applyPreset = useCallback((preset: string) => {
    const p = presetMap[preset];
    if (p) {
      updateInput("amount", p.amount);
      updateInput("rate", p.rate);
      updateInput("years", p.years);
      updateInput("preset", preset);
    }
  }, [updateInput]);

  const handleAmountInput = useCallback((v: string) => {
    updateInput("amount", parseFloat(v.replace(/[,\s]/g, "")) || 0);
    updateInput("preset", "other");
  }, [updateInput]);

  const handleRateInput = useCallback((v: string) => {
    updateInput("rate", parseFloat(v) || 0);
    updateInput("preset", "other");
  }, [updateInput]);

  const handleYearsInput = useCallback((v: string) => {
    updateInput("years", parseFloat(v) || 1);
    updateInput("preset", "other");
  }, [updateInput]);

  const handleAmountSlider = useCallback((v: number) => {
    updateInput("amount", v);
    updateInput("preset", "other");
  }, [updateInput]);

  const handleRateSlider = useCallback((v: number) => {
    updateInput("rate", v);
    updateInput("preset", "other");
  }, [updateInput]);

  const handleYearsSlider = useCallback((v: number) => {
    updateInput("years", v);
    updateInput("preset", "other");
  }, [updateInput]);

  const chartConfig = useMemo(() => r ? {
    type: "bar" as const,
    data: {
      labels: r.breakdown.map((b: { year: number }) => "Y" + b.year),
      datasets: [
        { label: "Principal Paid", data: r.breakdown.map((b: { principalPaid: number }) => b.principalPaid), backgroundColor: "#FF6B00" },
        { label: "Interest Paid", data: r.breakdown.map((b: { interestPaid: number }) => b.interestPaid), backgroundColor: "#1A1A1A" },
      ]
    },
    options: {
      plugins: { legend: { position: "bottom" as const } },
      scales: {
        y: { stacked: true, grid: { color: "rgba(255,255,255,0.06)", borderDash: [4, 4] as [number, number] }, border: { display: false } },
        x: { stacked: true, grid: { display: false }, border: { display: false } },
      }
    }
  } : null, [r]);

  const insights = r ? generateInsights("emi", r, inputs) : [];

  const heroValue = segment === "month" ? formatINRFull(r?.emi ?? 0)
    : segment === "year" ? formatINRFull(r ? Math.round(r.emi * 12) : 0)
    : formatINRFull(r?.totalPayment ?? 0);

  const heroSub = segment === "month" ? "Monthly EMI payment"
    : segment === "year" ? "Yearly payment amount"
    : "Total payment over loan term";

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="section-header">
            Loan Type
          </p>
          <Tabs value={String(inputs.preset || "home")} onValueChange={applyPreset}>
            <TabsList className="w-full">
              {loanPresets.map((p) => (
                <TabsTrigger key={p.value} value={p.value} className="flex-1 text-[clamp(9px,2.4vw,12px)] tracking-[-0.2px] overflow-hidden text-ellipsis">{p.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="section-divider" />
          <p className="section-header">
            Loan Details
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.amount), onChange: handleAmountInput, label: "AMOUNT", step: 50000 },
              { value: Number(inputs.rate), onChange: handleRateInput, label: "INTEREST", suffix: "%", step: 0.5 },
              { value: Number(inputs.years), onChange: handleYearsInput, label: "TENURE", suffix: "yr", step: 1 },
            ]}
            className="mb-5"
          />

          <NeonSlider
            label="LOAN AMOUNT"
            value={Number(inputs.amount)}
            onChange={handleAmountSlider}
            min={10000}
            max={10000000}
            step={10000}
            unit="₹"
            editable
            tickLabels={["10K", "25L", "50L", "75L", "1C"]}
          />

          <NeonSlider
            label="INTEREST RATE"
            value={Number(inputs.rate)}
            onChange={handleRateSlider}
            min={1}
            max={20}
            step={0.1}
            unit="% P.A."
            tickLabels={["1%", "6%", "10%", "15%", "20%"]}
          />

          <NeonSlider
            label="TENURE"
            value={Number(inputs.years)}
            onChange={handleYearsSlider}
            min={1}
            max={30}
            step={1}
            unit="YRS"
            tickLabels={["1 YR", "8 YR", "15 YR", "22 YR", "30 YR"]}
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
              <ResultHero value={heroValue} subtitle={heroSub} />

              <SegmentedResult
                segments={[
                  { value: "month", label: "PER MONTH" },
                  { value: "year", label: "PER YEAR" },
                  { value: "total", label: "TOTAL" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <Card className="bg-card border-border mt-4">
                <CardContent className="p-4 flex flex-col gap-1">
                  <MetricRow label="Principal Amount" value={formatINRFull(r.amount)} index={0} />
                  <MetricRow label="Total Interest" value={formatINRFull(r.totalInterest)} variant="negative" index={1} />
                  <MetricRow label="Total Payment" value={formatINRFull(r.totalPayment)} index={2} />
                  <MetricRow label="Interest to Loan Ratio" value={r.interestRatio.toFixed(1) + "%"} variant="negative" index={3} />
                </CardContent>
              </Card>

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
