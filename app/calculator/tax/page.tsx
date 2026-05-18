"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull, formatINR } from "@/lib/formatter";
import { taxNewRegime, taxOldRegime } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { InputSlider } from "@/components/calculator/InputSlider";
import { ResultCard } from "@/components/calculator/ResultCard";
import { InsightCard } from "@/components/calculator/InsightCard";
import { ResetCopyBar } from "@/components/calculator/ResetCopyBar";
import { Button } from "@/components/ui/button";
import { CalcIcon } from "@/components/shared/CalcIcon";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const defaultInputs = { income: 1000000, deduction80C: 150000, regime: "new" };

function calcFn(inputs: Record<string, unknown>) {
  const income = Math.max(0, Number(inputs.income) || 0);
  const deduction80C = Math.max(0, Number(inputs.deduction80C) || 0);
  const regime = String(inputs.regime || "new");
  const newResult = taxNewRegime(income);
  const oldResult = taxOldRegime(income, deduction80C);
  const current = regime === "new" ? newResult : oldResult;
  const savings = regime === "new" ? Math.max(0, oldResult.totalTax - newResult.totalTax) : Math.max(0, newResult.totalTax - oldResult.totalTax);
  return { ...current, newTotal: newResult.totalTax, oldTotal: oldResult.totalTax, savings, regime };
}

export default function TaxPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("tax", defaultInputs, calcFn);

  const r = result as ReturnType<typeof calcFn> | null;
  const isNewRegime = inputs.regime === "new";
  const insights = r ? generateInsights("tax", r, inputs) : [];

  const savings = r ? Math.abs(r.newTotal - r.oldTotal) : 0;
  const betterRegime = r && r.newTotal < r.oldTotal ? "New Regime" : r && r.oldTotal < r.newTotal ? "Old Regime" : "Same";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold flex items-center gap-2"><CalcIcon name="💸" className="w-5 h-5" /> Tax Calculator</h2>
        <p className="text-sm text-muted-foreground">FY 2025-26 — Budget 2025 tax slabs</p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Income Tax</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Regime Comparison</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />80C Savings</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Which tax regime are you using?</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateInput("regime", "new")}
            className={cn("p-3 rounded-xl border text-left space-y-1 transition-colors", isNewRegime ? "border-calc-accent bg-calc-accent-bg" : "bg-card hover:bg-muted/50")}
          >
            <span className="text-sm font-semibold block flex items-center gap-1.5"><CalcIcon name="✅" className="w-4 h-4" /> New Regime</span>
            <span className="text-[11px] text-muted-foreground block">Lower rates, no deductions</span>
          </button>
          <button
            onClick={() => updateInput("regime", "old")}
            className={cn("p-3 rounded-xl border text-left space-y-1 transition-colors", !isNewRegime ? "border-calc-accent bg-calc-accent-bg" : "bg-card hover:bg-muted/50")}
          >
            <span className="text-sm font-semibold block flex items-center gap-1.5"><CalcIcon name="📋" className="w-4 h-4" /> Old Regime</span>
            <span className="text-[11px] text-muted-foreground block">With 80C deductions</span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground/80">Most people save more with the New Regime</p>
      </div>

      <div className="space-y-5">
        <InputSlider id="tax-income" label="Annual Gross Income" icon="💰" value={Number(inputs.income)} min={100000} max={10000000} step={50000} unit="₹" unitPosition="prefix" formatValue={(v) => formatINR(v)} helperText="Your CTC or total yearly salary" onChange={(v) => updateInput("income", v)} />

        {!isNewRegime && (
          <InputSlider id="tax-deduction" label="80C Investments" icon="📋" value={Number(inputs.deduction80C)} min={0} max={150000} step={5000} unit="₹" unitPosition="prefix" formatValue={(v) => formatINR(v)} helperText="PPF, ELSS, LIC, PF — max ₹1.5L" onChange={(v) => updateInput("deduction80C", v)} />
        )}
      </div>

      <div className="flex gap-2">
        <ResetCopyBar onReset={resetInputs} summaryObj={r ? { Calculator: "Tax", Income: formatINR(Number(inputs.income)), Regime: isNewRegime ? "New" : "Old", "Tax Payable": formatINRFull(r.totalTax), "Effective Rate": `${r.effectiveRate.toFixed(2)}%`, "Take Home": formatINRFull(Number(inputs.income) - r.totalTax) } : undefined} />
      </div>

      {r && (
        <>
          <ResultCard
            heroLabel="Tax You Pay"
            heroValue={formatINRFull(r.totalTax)}
            heroVariant="negative"
            metrics={[
              { label: "Taxable Income", value: formatINRFull(r.taxable) },
              { label: "Base Tax", value: formatINRFull(r.baseTax) },
              { label: "Effective Rate", value: `${r.effectiveRate.toFixed(2)}%` },
            ]}
            summary={`You pay ${formatINRFull(r.totalTax)} in tax on ₹${Number(inputs.income).toLocaleString("en-IN")} income. Your take-home is ${formatINRFull(Number(inputs.income) - r.totalTax)}.`}
          />

          <div className="p-4 rounded-xl border bg-card space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">TAX BREAKDOWN</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span>Gross Income</span><span className="tabular-nums font-medium">{formatINRFull(Number(inputs.income))}</span></div>
              <div className="flex justify-between"><span>Standard Deduction</span><span className="tabular-nums text-calc-positive">−{isNewRegime ? "₹75,000" : "₹50,000"}</span></div>
              {!isNewRegime && <div className="flex justify-between"><span>80C Deduction</span><span className="tabular-nums text-calc-positive">−{formatINRFull(Math.min(Number(inputs.deduction80C), 150000))}</span></div>}
              <Separator />
              <div className="flex justify-between"><span>Taxable Income</span><span className="tabular-nums font-medium">{formatINRFull(r.taxable)}</span></div>
              <div className="flex justify-between"><span>Base Tax</span><span className="tabular-nums">{formatINRFull(r.baseTax)}</span></div>
              <div className="flex justify-between"><span>+ 4% Cess</span><span className="tabular-nums">{formatINRFull(r.cess)}</span></div>
              <Separator />
              <div className="flex justify-between text-base font-bold"><span>Total Tax</span><span className="tabular-nums text-calc-negative">{formatINRFull(r.totalTax)}</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">REGIME COMPARISON</p>
              <p className="text-sm mt-1">
                <span className="text-calc-positive">{betterRegime}</span> saves you <strong>{formatINRFull(savings)}</strong>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">New: <span className="tabular-nums font-medium">{formatINRFull(r.newTotal)}</span></p>
              <p className="text-xs text-muted-foreground">Old: <span className="tabular-nums font-medium">{formatINRFull(r.oldTotal)}</span></p>
            </div>
          </div>

          <InsightCard insights={insights} />
        </>
      )}
    </div>
  );
}
