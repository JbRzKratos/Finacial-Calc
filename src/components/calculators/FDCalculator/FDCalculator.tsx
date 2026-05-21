"use client";

import { useCallback, useMemo, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { fdMaturity, rdMaturity } from "@/utils/calculations";
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

  const handleDepositTypeChange = useCallback((v: string) => {
    updateInput("depositType", v);
  }, [updateInput]);

  const handleAmountInput = useCallback((v: string) => {
    updateInput("amount", parseFloat(v.replace(/[,\s]/g, "")) || 0);
  }, [updateInput]);

  const handleRateSlider = useCallback((v: number) => {
    updateInput("rate", v);
  }, [updateInput]);

  const handleYearsSlider = useCallback((v: number) => {
    updateInput("years", v);
  }, [updateInput]);

  const handleCompoundingChange = useCallback((v: string) => {
    updateInput("compounding", v);
  }, [updateInput]);

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
          <p className="section-header">
            Deposit Type
          </p>
          <Tabs value={String(inputs.depositType || "fd")} onValueChange={handleDepositTypeChange}>
            <TabsList className="w-full">
              <TabsTrigger value="fd" className="flex-1 text-[clamp(10px,2.8vw,13px)]">FIXED DEPOSIT</TabsTrigger>
              <TabsTrigger value="rd" className="flex-1 text-[clamp(10px,2.8vw,13px)]">RECURRING DEPOSIT</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="section-divider" />
          {String(inputs.depositType) === "rd" ? (
            <p className="section-header">
              Monthly Deposit
            </p>
          ) : (
            <p className="section-header">
              Principal Amount
            </p>
          )}
          <InputRow
            fields={[{
              value: Number(inputs.amount),
              onChange: handleAmountInput,
              label: String(inputs.depositType) === "rd" ? "MONTHLY" : "AMOUNT", step: 5000,
            }]}
            className="mb-5"
          />

          <NeonSlider
            label="INTEREST RATE"
            value={Number(inputs.rate)}
            onChange={handleRateSlider}
            min={1}
            max={15}
            step={0.1}
            unit="% P.A."
            tickLabels={["1%", "4%", "7%", "11%", "15%"]}
          />

          <NeonSlider
            label="DURATION"
            value={Number(inputs.years)}
            onChange={handleYearsSlider}
            min={1}
            max={30}
            step={1}
            unit="YRS"
            tickLabels={["1 YR", "8 YR", "15 YR", "22 YR", "30 YR"]}
          />

          {String(inputs.depositType) === "fd" && (
            <>
              <div className="section-divider" />
              <p className="section-header">
                Compounding Frequency
              </p>
              <Tabs value={String(inputs.compounding || "quarterly")} onValueChange={handleCompoundingChange}>
                <TabsList className="w-full overflow-hidden">
                  {compoundingOptions.map((opt) => (
                    <TabsTrigger key={opt.value} value={opt.value} className="flex-1 text-[clamp(8.5px,2.2vw,11px)] px-1 py-1.5">{opt.label}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
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
