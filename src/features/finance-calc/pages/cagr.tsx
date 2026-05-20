"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINRFull } from "@/features/finance-calc/utils/formatter";
import { cagr, ruleOf72 } from "@/features/finance-calc/utils/math";
import { generateInsights } from "@/features/finance-calc/utils/insights";
import { SplitShell } from "@/features/finance-calc/components/layout/SplitShell";
import { InputRow } from "@/features/finance-calc/components/inputs/InputRow";
import { NeonSlider } from "@/features/finance-calc/components/inputs/NeonSlider";
import { ActionButtonRow } from "@/features/finance-calc/components/inputs/ActionButtonRow";
import { ResultHero } from "@/features/finance-calc/components/results/ResultHero";
import { MetricRow } from "@/features/finance-calc/components/results/MetricRow";
import { InsightBanner } from "@/features/finance-calc/components/results/InsightBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const defaultInputs = { initial: 100000, final: 250000, years: 5 };
const benchmarkMap: Record<string, number> = { nifty: 12, fd: 7 };
const benchmarkNames: Record<string, string> = { nifty: "Nifty 50", fd: "FD (7%)" };

function calcFn(inputs: Record<string, unknown>) {
  const initial = Math.max(0, Number(inputs.initial) || 0);
  const final = Math.max(0, Number(inputs.final) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const cagrVal = cagr(initial, final, years);
  const absReturn = final - initial;
  const doubleYears = Math.round(ruleOf72(cagrVal));
  return { cagr: cagrVal, absReturn, doubleYears, initial, final, years };
}

export default function CAGRPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("cagr", defaultInputs, calcFn);
  const [segment, setSegment] = useState("my");
  const r = result as ReturnType<typeof calcFn> | null;

  const benchmarkKey = String(inputs.benchmark || "nifty");
  const benchmarkRate = benchmarkMap[benchmarkKey] ?? 12;
  const selectedBenchmark = benchmarkNames[benchmarkKey] || "Nifty 50";
  const outperformance = r ? r.cagr - benchmarkRate : 0;

  const insights = r ? generateInsights("cagr", r, inputs) : [];

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Investment Details
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.initial), onChange: (v) => updateInput("initial", parseFloat(v.replace(/[,\s]/g, "")) || 0), label: "INITIAL" },
              { value: Number(inputs.final), onChange: (v) => updateInput("final", parseFloat(v.replace(/[,\s]/g, "")) || 0), label: "FINAL" },
              { value: Number(inputs.years), onChange: (v) => updateInput("years", parseFloat(v) || 1), label: "YEARS", suffix: "yr" },
            ]}
            className="mb-5"
          />

          <NeonSlider
            label="INITIAL INVESTMENT"
            value={Number(inputs.initial)}
            onChange={(v) => updateInput("initial", v)}
            min={1000}
            max={10000000}
            step={1000}
            unit="₹"
            editable
            tickLabels={["1K", "2.5M", "5M", "7.5M", "10M"]}
          />

          <NeonSlider
            label="FINAL VALUE"
            value={Number(inputs.final)}
            onChange={(v) => updateInput("final", v)}
            min={1000}
            max={50000000}
            step={1000}
            unit="₹"
            editable
            tickLabels={["1K", "12.5M", "25M", "37.5M", "50M"]}
          />

          <NeonSlider
            label="INVESTMENT PERIOD"
            value={Number(inputs.years)}
            onChange={(v) => updateInput("years", v)}
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
              <ResultHero value={r.cagr.toFixed(2) + "%"} subtitle="Compound Annual Growth Rate" variant="accent" />

              <Card className="bg-card border-border mt-4">
                <CardContent className="p-4 flex flex-col gap-1">
                  <MetricRow label="Absolute Return" value={formatINRFull(r.absReturn)} variant="positive" index={0} />
                  <MetricRow label="Total Growth" value={(r.absReturn / r.initial * 100).toFixed(1) + "%"} index={1} />
                  <MetricRow label="Doubling Period" value={r.doubleYears + " yrs"} index={2} />
                  <div className="flex justify-between items-center py-2.5 px-3">
                    <span className="text-xs font-semibold tracking-[0.06em] text-white/40 uppercase">vs {selectedBenchmark}</span>
                    <Badge className={outperformance >= 0 ? "bg-green-500/10 text-green-400 border-green-500/20 text-[10px] font-semibold" : "bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-semibold"}>
                      {outperformance >= 0 ? "+" : ""}{outperformance.toFixed(2)}%
                    </Badge>
                  </div>
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
