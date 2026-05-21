"use client";

import { useState } from "react";
import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINRFull } from "@/features/finance-calc/utils/formatter";
import { retirementCorpus } from "@/features/finance-calc/utils/math";
import { generateInsights } from "@/features/finance-calc/utils/insights";
import { SplitShell } from "@/features/finance-calc/components/layout/SplitShell";
import { InputRow } from "@/features/finance-calc/components/inputs/InputRow";
import { NeonSlider } from "@/features/finance-calc/components/inputs/NeonSlider";
import { ActionButtonRow } from "@/features/finance-calc/components/inputs/ActionButtonRow";
import { ResultHero } from "@/features/finance-calc/components/results/ResultHero";
import { MetricRow } from "@/features/finance-calc/components/results/MetricRow";
import { InsightBanner } from "@/features/finance-calc/components/results/InsightBanner";
import { TimelineBar } from "@/features/finance-calc/components/results/TimelineBar";
import { Card, CardContent } from "@/components/ui/card";

const defaultInputs = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 85,
  monthlyExpense: 50000,
  inflation: 6,
  returns: 10,
};

function calcFn(inputs: Record<string, unknown>) {
  const currentAge = Math.max(1, Number(inputs.currentAge) || 30);
  const retirementAge = Math.max(currentAge + 1, Number(inputs.retirementAge) || 60);
  const lifeExpectancy = Math.max(retirementAge + 1, Number(inputs.lifeExpectancy) || 85);
  const monthlyExpense = Math.max(0, Number(inputs.monthlyExpense) || 0);
  const inflation = Math.max(0, Number(inputs.inflation) || 6);
  const returns = Math.max(0, Number(inputs.returns) || 10);
  return retirementCorpus(monthlyExpense, inflation, currentAge, retirementAge, lifeExpectancy, returns);
}

export default function RetirementPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("retirement", defaultInputs, calcFn);
  const r = result as ReturnType<typeof calcFn> | null;

  const insights = r ? generateInsights("retirement", r, inputs) : [];

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Your Profile
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.currentAge), onChange: (v) => updateInput("currentAge", parseFloat(v) || 1), label: "CURRENT AGE", suffix: "yr", step: 1 },
              { value: Number(inputs.retirementAge), onChange: (v) => updateInput("retirementAge", parseFloat(v) || 1), label: "RETIRE AGE", suffix: "yr", step: 1 },
              { value: Number(inputs.lifeExpectancy), onChange: (v) => updateInput("lifeExpectancy", parseFloat(v) || 1), label: "LIFE EXPECT", suffix: "yr", step: 1 },
            ]}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Monthly Expenses (Today)
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.monthlyExpense),
              onChange: (v) => updateInput("monthlyExpense", parseFloat(v.replace(/[,\s]/g, "")) || 0),
              label: "EXPENSES", step: 5000,
            }]}
            className="mb-5"
          />

          <NeonSlider
            label="INFLATION RATE"
            value={Number(inputs.inflation)}
            onChange={(v) => updateInput("inflation", v)}
            min={1}
            max={15}
            step={0.5}
            unit="%"
            tickLabels={["1%", "4%", "6%", "10%", "15%"]}
          />

          <NeonSlider
            label="EXPECTED INVESTMENT RETURN"
            value={Number(inputs.returns)}
            onChange={(v) => updateInput("returns", v)}
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
              <ResultHero value={formatINRFull(r.corpus)} subtitle="Retirement corpus needed" variant="accent" />

              <Card className="bg-card border-border mt-4">
                <CardContent className="p-4 flex flex-col gap-1">
                  <MetricRow label="Future Monthly Expense" value={formatINRFull(r.fme)} index={0} />
                  <MetricRow label="Monthly SIP Required" value={formatINRFull(r.monthlySip)} variant="positive" index={1} />
                  <MetricRow label="Years to Retire" value={r.yearsToRetire + " yrs"} index={2} />
                </CardContent>
              </Card>

              <TimelineBar
                currentAge={Number(inputs.currentAge) || 30}
                retirementAge={Number(inputs.retirementAge) || 60}
                lifeExpectancy={Number(inputs.lifeExpectancy) || 85}
              />

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
