"use client";

import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINRFull } from "@/features/finance-calc/utils/formatter";
import { taxNewRegime, taxOldRegime } from "@/features/finance-calc/utils/math";
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

const defaultInputs = { income: 1200000, deduction80C: 150000, deduction80D: 25000, hra: 0 };

function calcFn(inputs: Record<string, unknown>) {
  const income = Math.max(0, Number(inputs.income) || 0);
  const deduction80C = Math.max(0, Number(inputs.deduction80C) || 0);
  const deduction80D = Math.max(0, Number(inputs.deduction80D) || 0);
  const hra = Math.max(0, Number(inputs.hra) || 0);
  const oldRegime = taxOldRegime(income, deduction80C);
  const newRegime = taxNewRegime(income);
  const savings = oldRegime.totalTax - newRegime.totalTax;
  const betterRegime = savings > 0 ? "new" : "old";
  return { ...oldRegime, ...newRegime, oldTotal: oldRegime.totalTax, newTotal: newRegime.totalTax, savings: Math.abs(savings), betterRegime, income, effectiveOld: oldRegime.effectiveRate, effectiveNew: newRegime.effectiveRate };
}

export default function TaxPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("tax", defaultInputs, calcFn);
  const r = result as ReturnType<typeof calcFn> | null;

  const insights = r ? generateInsights("tax", r, inputs) : [];

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Income & Deductions
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.income), onChange: (v) => updateInput("income", parseFloat(v.replace(/[,\s]/g, "")) || 0), label: "ANNUAL INCOME" },
              { value: Number(inputs.deduction80C), onChange: (v) => updateInput("deduction80C", parseFloat(v.replace(/[,\s]/g, "")) || 0), label: "80C (PF/ELSS)" },
            ]}
            className="mb-5"
          />
          <InputRow
            fields={[
              { value: Number(inputs.deduction80D), onChange: (v) => updateInput("deduction80D", parseFloat(v.replace(/[,\s]/g, "")) || 0), label: "80D (MEDICAL)" },
              { value: Number(inputs.hra), onChange: (v) => updateInput("hra", parseFloat(v.replace(/[,\s]/g, "")) || 0), label: "HRA" },
            ]}
            className="mb-5"
          />

          <NeonSlider
            label="ANNUAL INCOME"
            value={Number(inputs.income)}
            onChange={(v) => updateInput("income", v)}
            min={250000}
            max={50000000}
            step={50000}
            unit="₹"
            editable
            tickLabels={["2.5L", "1Cr", "2.5Cr", "3.5Cr", "5Cr"]}
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
              <div className="flex items-center justify-center gap-3 mb-4">
                <Badge className={r.betterRegime === "new" ? "bg-green-500/10 text-green-400 border-green-500/20 text-xs font-semibold" : "bg-white/5 text-white/40 border-white/10 text-xs font-semibold"}>
                  New Regime: ₹{r.newTotal.toLocaleString("en-IN")}
                </Badge>
                <Badge className={r.betterRegime === "old" ? "bg-green-500/10 text-green-400 border-green-500/20 text-xs font-semibold" : "bg-white/5 text-white/40 border-white/10 text-xs font-semibold"}>
                  Old Regime: ₹{r.oldTotal.toLocaleString("en-IN")}
                </Badge>
              </div>

              <ResultHero
                value={"₹" + r.savings.toLocaleString("en-IN")}
                subtitle={"You save this much with the " + r.betterRegime.toUpperCase() + " Regime"}
                variant="positive"
              />

              <Card className="bg-card border-border mt-4">
                <CardContent className="p-4 flex flex-col gap-1">
                  <MetricRow label="Tax (New Regime)" value={formatINRFull(r.newTotal)} index={0} />
                  <MetricRow label="Tax (Old Regime)" value={formatINRFull(r.oldTotal)} index={1} />
                  <MetricRow label="Effective Rate (New)" value={r.effectiveNew.toFixed(2) + "%"} index={2} />
                  <MetricRow label="Effective Rate (Old)" value={r.effectiveOld.toFixed(2) + "%"} index={3} />
                  <MetricRow label="Taxable Income" value={formatINRFull(r.taxable)} index={4} />
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
