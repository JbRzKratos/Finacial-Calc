"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/features/finance-calc/utils/formatter";
import { sipFV, ruleOf72 } from "@/features/finance-calc/utils/math";
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
import { Card, CardContent } from "@/components/ui/card";

const defaultInputs = { amount: 5000, years: 10, rate: 12, stepUp: "0" };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const stepUp = Math.max(0, Number(inputs.stepUp) || 0) / 100;
  const months = years * 12;

  let maturity: number;
  let invested: number;
  if (stepUp === 0) {
    maturity = sipFV(amount, months, rate);
    invested = amount * months;
  } else {
    let totalFV = 0;
    invested = 0;
    let monthlyAmount = amount;
    const r = rate / 12 / 100;
    for (let y = 0; y < years; y++) {
      const fvYearEnd = sipFV(monthlyAmount, 12, rate);
      const monthsAfter = (years - y - 1) * 12;
      totalFV += fvYearEnd * (r > 0 ? Math.pow(1 + r, monthsAfter) : 1);
      invested += monthlyAmount * 12;
      monthlyAmount *= (1 + stepUp);
    }
    maturity = Math.round(totalFV);
  }

  const returns = Math.max(0, maturity - invested);
  const doubleYears = rate > 0 ? Math.round(ruleOf72(rate)) : 0;
  return {
    maturity: Math.round(maturity),
    invested: Math.round(invested),
    returns: Math.round(returns),
    doubleYears,
    growthPct: invested > 0 ? ((returns / invested) * 100) : 0,
  };
}

export default function SIPPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("sip", defaultInputs, calcFn);
  const [segment, setSegment] = useState("total");
  const r = result as ReturnType<typeof calcFn> | null;

  const chartConfig = useMemo(() => r ? {
    type: "doughnut" as const,
    data: {
      labels: ["Principal Invested", "Est. Returns"],
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

  const insights = r ? generateInsights("sip", r, inputs) : [];

  const segmentValue = segment === "yearly" && r
    ? formatINRFull(Math.round(r.maturity / r.invested * 100000))
    : formatINRFull(r?.maturity ?? 0);

  const segmentSub = segment === "total" ? "Estimated maturity value"
    : segment === "yearly" ? "Average annual return"
    : "Total investment amount";

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Monthly Investment
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.amount),
              onChange: (v) => updateInput("amount", parseFloat(v.replace(/[,\s]/g, "")) || 0),
              label: "AMOUNT",
            }]}
            className="mb-5"
          />
          <p className="text-[11px] text-white/60 -mt-3 mb-5">Min 500 -- Max 1,00,000</p>

          <NeonSlider
            label="INVESTMENT DURATION"
            value={Number(inputs.years)}
            onChange={(v) => updateInput("years", v)}
            min={1}
            max={40}
            step={1}
            unit="YRS"
            tickLabels={["1 YR", "10 YR", "20 YR", "30 YR", "40 YR"]}
          />

          <NeonSlider
            label="EXPECTED ANNUAL RETURN"
            value={Number(inputs.rate)}
            onChange={(v) => updateInput("rate", v)}
            min={1}
            max={30}
            step={0.5}
            unit="% P.A."
            tickLabels={["1%", "8%", "15%", "22%", "30%"]}
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Step-up SIP Yearly
          </p>
          <ToggleGroup
            options={[
              { value: "0", label: "OFF" },
              { value: "5", label: "5%" },
              { value: "10", label: "10%" },
              { value: "15", label: "15%" },
              { value: "20", label: "20%" },
            ]}
            value={String(inputs.stepUp || "0")}
            onChange={(v) => updateInput("stepUp", v)}
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
              <ResultHero value={segmentValue} subtitle={segmentSub} variant="default" />

              <SegmentedResult
                segments={[
                  { value: "total", label: "TOTAL" },
                  { value: "yearly", label: "YEARLY" },
                  { value: "monthly", label: "MONTHLY" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <Card className="bg-card border-border mt-4">
                <CardContent className="p-4 flex flex-col gap-1">
                  <MetricRow label="Invested Amount" value={formatINRFull(r?.invested ?? 0)} index={0} />
                  <MetricRow label="Estimated Returns" value={formatINRFull(r?.returns ?? 0)} variant="positive" index={1} />
                  <MetricRow label="Growth Rate" value={(r?.growthPct ?? 0).toFixed(1) + "%"} index={2} />
                  <MetricRow label="Total Value" value={formatINRFull(r?.maturity ?? 0)} variant="accent" index={3} />
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
