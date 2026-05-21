"use client";

import { useCallback, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { retirementCorpus } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { SplitShell } from "@/components/layout/SplitShell";
import { InputRow } from "@/components/common/StepperBox/StepperBox";
import { NeonSlider } from "@/components/common/SliderInput/SliderInput";
import { ActionButtonRow } from "@/components/common/ActionButtonRow/ActionButtonRow";
import { ResultHero } from "@/components/common/ResultHero/ResultHero";
import { MetricRow } from "@/components/common/MetricRow/MetricRow";
import { InsightBanner } from "@/components/common/InsightBanner/InsightBanner";
import { TimelineBar } from "@/components/common/TimelineBar/TimelineBar";
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

  const handleCurrentAgeInput = useCallback((v: string) => {
    updateInput("currentAge", parseFloat(v) || 1);
  }, [updateInput]);

  const handleRetirementAgeInput = useCallback((v: string) => {
    updateInput("retirementAge", parseFloat(v) || 1);
  }, [updateInput]);

  const handleLifeExpectInput = useCallback((v: string) => {
    updateInput("lifeExpectancy", parseFloat(v) || 1);
  }, [updateInput]);

  const handleExpenseInput = useCallback((v: string) => {
    updateInput("monthlyExpense", parseFloat(v.replace(/[,\s]/g, "")) || 0);
  }, [updateInput]);

  const handleInflationSlider = useCallback((v: number) => {
    updateInput("inflation", v);
  }, [updateInput]);

  const handleReturnsSlider = useCallback((v: number) => {
    updateInput("returns", v);
  }, [updateInput]);

  const insights = r ? generateInsights("retirement", r, inputs) : [];

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="section-header">
            Your Profile
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.currentAge), onChange: handleCurrentAgeInput, label: "CURRENT AGE", suffix: "yr", step: 1 },
              { value: Number(inputs.retirementAge), onChange: handleRetirementAgeInput, label: "RETIRE AGE", suffix: "yr", step: 1 },
              { value: Number(inputs.lifeExpectancy), onChange: handleLifeExpectInput, label: "LIFE EXPECT", suffix: "yr", step: 1 },
            ]}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="section-header">
            Monthly Expenses (Today)
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.monthlyExpense),
              onChange: handleExpenseInput,
              label: "EXPENSES", step: 5000,
            }]}
            className="mb-5"
          />

          <NeonSlider
            label="INFLATION RATE"
            value={Number(inputs.inflation)}
            onChange={handleInflationSlider}
            min={1}
            max={15}
            step={0.5}
            unit="%"
            tickLabels={["1%", "4%", "6%", "10%", "15%"]}
          />

          <NeonSlider
            label="EXPECTED INVESTMENT RETURN"
            value={Number(inputs.returns)}
            onChange={handleReturnsSlider}
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
