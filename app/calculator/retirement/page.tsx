"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/lib/formatter";
import { retirementCorpus } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { SplitShell } from "@/components/layout/SplitShell";
import { InputRow } from "@/components/ui-custom/InputRow";
import { BrandSlider } from "@/components/ui-custom/BrandSlider";
import { ToggleGroup } from "@/components/ui-custom/ToggleGroup";
import { ActionButtonRow } from "@/components/ui-custom/ActionButtonRow";
import { ResultHero } from "@/components/ui-custom/ResultHero";
import { MetricRow } from "@/components/ui-custom/MetricRow";
import { InsightBanner } from "@/components/ui-custom/InsightBanner";
import { SegmentedResult } from "@/components/ui-custom/SegmentedResult";
import { ResultChart } from "@/components/ui-custom/ResultChart";
import { TimelineBar } from "@/components/ui-custom/TimelineBar";

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
      labels: ["Now", `Age ${inputs.retirementAge as number} (Retire)`, `Age ${inputs.lifeExpectancy as number}`],
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
          <p className="text-[11px] font-medium text-white/50 uppercase tracking-[0.08em] mb-3">
            FinCalc Pro <span className="text-white/30">›</span>{" "}
            <span className="text-white/90 font-bold">Retirement Planner</span>
          </p>
          <p className="text-[clamp(16px,2.5vw,20px)] font-bold text-white/95 tracking-[-0.01em] mb-1">
            Retirement Planner
          </p>
          <p className="text-[12px] font-medium text-white/70 mb-5">
            Your future, planned today
          </p>

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

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Monthly Lifestyle
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.monthlyExpense),
              onChange: (v) => updateInput("monthlyExpense", parseFloat(v.replace(/[₹,\s]/g, "")) || 0),
              label: "CURRENT MONTHLY EXPENSES",
            }]}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-3">
            Inflation Outlook
          </p>
          <BrandSlider
            stops={inflationStops}
            value={Number(inputs.inflation)}
            onChange={(v) => updateInput("inflation", v)}
            className="mb-6"
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
                value={formatINRFull(r?.corpus ?? 0)}
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
                <MetricRow label="Monthly Expense at Retire" value={formatINRFull(r?.fme ?? 0)} index={0} />
                <MetricRow label="Years in Retirement" value={r ? `${r.yearsToRetire}yr` : "-"} index={1} />
                <MetricRow label="Monthly SIP Needed" value={formatINRFull(r?.monthlySip ?? 0)} variant="accent" index={2} />
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
