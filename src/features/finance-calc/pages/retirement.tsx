"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/features/finance-calc/utils/formatter";
import { retirementCorpus } from "@/features/finance-calc/utils/math";
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
import { TimelineBar } from "@/features/finance-calc/components/results/TimelineBar";

const defaultInputs = { currentAge: 30, retirementAge: 60, lifeExpectancy: 85, monthlyExpense: 50000, inflation: 6, investReturn: 10 };

function calcFn(inputs: Record<string, unknown>) {
  const currentAge = Math.max(18, Math.min(55, Number(inputs.currentAge) || 30));
  const retirementAge = Math.max(currentAge + 1, Number(inputs.retirementAge) || 60);
  const lifeExpectancy = Math.max(retirementAge + 1, Number(inputs.lifeExpectancy) || 85);
  const monthlyExpense = Math.max(0, Number(inputs.monthlyExpense) || 0);
  const inflation = Math.max(0, Number(inputs.inflation) || 0);
  const investReturn = Math.max(0, Number(inputs.investReturn) || 0);
  return retirementCorpus(monthlyExpense, inflation, currentAge, retirementAge, lifeExpectancy, investReturn);
}

const inflationStops = [
  { value: 4, label: "LOW (4%)" },
  { value: 6, label: "MODERATE (6%)" },
  { value: 8, label: "HIGH (8%)" },
];

const strategyOpts = [
  { value: "8", label: "CONSERVATIVE" },
  { value: "10", label: "BALANCED" },
  { value: "12", label: "AGGRESSIVE" },
];

export default function RetirementPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("retirement", defaultInputs, calcFn);
  const [segment, setSegment] = useState("corpus");
  const r = result as ReturnType<typeof calcFn> | null;

  const chartConfig = useMemo(() => r ? {
    type: "line" as const,
    data: {
      labels: ["Now", "Age " + inputs.retirementAge + " (Retire)", "Age " + inputs.lifeExpectancy],
      datasets: [{
        label: "Corpus Needed",
        data: [0, r.corpus, 0],
        borderColor: "#FF6B00",
        backgroundColor: "rgba(255,107,0,0.08)",
        fill: true,
      }]
    },
    options: {
      plugins: { legend: { position: "bottom" as const } },
    }
  } : null, [r, inputs.retirementAge, inputs.lifeExpectancy]);

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
              { value: Number(inputs.currentAge), onChange: (v) => updateInput("currentAge", Math.max(18, Math.min(55, parseInt(v) || 18))), label: "CURRENT AGE" },
              { value: Number(inputs.retirementAge), onChange: (v) => updateInput("retirementAge", Math.max(Number(inputs.currentAge) + 1, parseInt(v) || 60)), label: "RETIRE AT" },
              { value: Number(inputs.lifeExpectancy), onChange: (v) => updateInput("lifeExpectancy", Math.max(Number(inputs.retirementAge) + 1, parseInt(v) || 85)), label: "LIVE UNTIL" },
            ]}
            className="mb-5"
          />

          <NeonSlider
            label="CURRENT AGE"
            value={Number(inputs.currentAge)}
            onChange={(v) => updateInput("currentAge", v)}
            min={18}
            max={55}
            step={1}
            unit="YRS"
            tickLabels={["18", "28", "36", "45", "55"]}
          />

          <NeonSlider
            label="RETIREMENT AGE"
            value={Number(inputs.retirementAge)}
            onChange={(v) => updateInput("retirementAge", v)}
            min={50}
            max={70}
            step={1}
            unit="YRS"
            tickLabels={["50", "55", "60", "65", "70"]}
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Monthly Lifestyle
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.monthlyExpense),
              onChange: (v) => updateInput("monthlyExpense", parseFloat(v.replace(/[,\s]/g, "")) || 0),
              label: "CURRENT MONTHLY EXPENSES",
            }]}
            className="mb-5"
          />

          <NeonSlider
            label="MONTHLY EXPENSE"
            value={Number(inputs.monthlyExpense)}
            onChange={(v) => updateInput("monthlyExpense", v)}
            min={5000}
            max={200000}
            step={1000}
            unit="₹"
            editable
            tickLabels={["5K", "55K", "100K", "150K", "200K"]}
          />

          <NeonSlider
            label="EXPECTED RETURN"
            value={Number(inputs.investReturn)}
            onChange={(v) => updateInput("investReturn", v)}
            min={1}
            max={20}
            step={0.5}
            unit="% P.A."
            tickLabels={["1%", "6%", "10%", "15%", "20%"]}
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Investment Strategy
          </p>
          <ToggleGroup
            options={strategyOpts}
            value={String(inputs.investReturn || "10")}
            onChange={(v) => updateInput("investReturn", parseInt(v))}
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
                value={formatINRFull(r.corpus)}
                subtitle="Corpus needed to retire comfortably"
              />

              <SegmentedResult
                segments={[
                  { value: "corpus", label: "CORPUS" },
                  { value: "sip", label: "SIP NEEDED" },
                  { value: "timeline", label: "TIMELINE" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <div className="mt-1">
                <MetricRow label="Monthly Expense at Retire" value={formatINRFull(r.fme)} index={0} />
                <MetricRow label="Years in Retirement" value={r.yearsToRetire + "yr"} index={1} />
                <MetricRow label="Monthly SIP Needed" value={formatINRFull(r.monthlySip)} variant="accent" index={2} />
              </div>

              {insights.length > 0 && (
                <InsightBanner title={insights[0].title} body={insights[0].description} />
              )}

              {chartConfig && (
                <div className="mt-6">
                  <ResultChart config={chartConfig} height={240} />
                </div>
              )}

              <TimelineBar
                currentAge={Number(inputs.currentAge)}
                retirementAge={Number(inputs.retirementAge)}
                lifeExpectancy={Number(inputs.lifeExpectancy)}
              />
            </>
          )}
        </>
      }
    />
  );
}
