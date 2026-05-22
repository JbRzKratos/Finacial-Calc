/* src/components/calculators/TaxCalculator/TaxCalculator.tsx */

import * as React from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { taxNewRegime, taxOldRegime } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { logCalculatorUsage, formatINR } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "../AnimatedNumber";

const defaultInputs = { income: 1200000, deduction80C: 150000, deduction80D: 25000, hra: 0 };

function calcFn(inputs: Record<string, unknown>) {
  const income = Math.max(0, Number(inputs.income) || 0);
  const deduction80C = Math.max(0, Number(inputs.deduction80C) || 0);
  const deduction80D = Math.max(0, Number(inputs.deduction80D) || 0);
  const hra = Math.max(0, Number(inputs.hra) || 0);
  const oldRegime = taxOldRegime(income, deduction80C + deduction80D + hra);
  const newRegime = taxNewRegime(income);
  const savings = oldRegime.totalTax - newRegime.totalTax;
  const betterRegime = savings > 0 ? "new" : "old";
  const better = betterRegime === "new" ? newRegime : oldRegime;
  return { 
    ...better, 
    oldTotal: oldRegime.totalTax, 
    newTotal: newRegime.totalTax, 
    savings: Math.abs(savings), 
    betterRegime, 
    income, 
    effectiveOld: oldRegime.effectiveRate, 
    effectiveNew: newRegime.effectiveRate 
  };
}

export default function TaxPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("tax", defaultInputs, calcFn);
  const r = result as ReturnType<typeof calcFn> | null;

  // Track results history
  React.useEffect(() => {
    if (r) {
      logCalculatorUsage(
        "tax",
        `Save ${formatINRFull(r.savings)}`,
        `Income: ${formatINR(Number(inputs.income))}, 80C: ${formatINR(Number(inputs.deduction80C))}, HRA: ${formatINR(Number(inputs.hra))}`
      );
    }
  }, [r, inputs.income, inputs.deduction80C, inputs.hra]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("income", val);
  };

  const handle80CChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("deduction80C", val);
  };

  const handle80DChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("deduction80D", val);
  };

  const handleHRAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("hra", val);
  };

  const handleIncomeSlider = (val: number) => {
    updateInput("income", val);
  };

  const insights = r ? generateInsights("tax", r, inputs) : [];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-base leading-none select-none text-primary font-black" aria-hidden="true">#</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Tax Calculator</h2>
          <p className="text-xs text-muted-foreground">Compare Old vs New Tax Regimes (FY 2024-25)</p>
        </div>
      </div>

      {/* Regime Badges Comparison */}
      {r && (
        <div className="flex items-center justify-center gap-3">
          <Badge className={r.betterRegime === "new" ? "bg-primary/15 text-primary border-primary/30 text-[10px] font-black" : "bg-muted/40 text-muted-foreground border-border text-[10px] font-bold"}>
            New Regime: {formatINRFull(r.newTotal)}
          </Badge>
          <Badge className={r.betterRegime === "old" ? "bg-primary/15 text-primary border-primary/30 text-[10px] font-black" : "bg-muted/40 text-muted-foreground border-border text-[10px] font-bold"}>
            Old Regime: {formatINRFull(r.oldTotal)}
          </Badge>
        </div>
      )}

      {/* Result Hero Card */}
      {r && (
        <Card className="border border-border bg-card/45 rounded-3xl overflow-hidden relative shadow-md">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Estimated Tax Savings
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary tabular-nums">
              <AnimatedNumber value={r.savings} formatter={formatINRFull} />
            </h1>
            <span className="text-[10px] text-muted-foreground mt-1.5 font-semibold text-primary">
              Prefer the {r.betterRegime.toUpperCase()} Tax Regime
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 px-4 pb-5 pt-2 border-t border-border/50 text-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Effective Rate (New)</span>
              <span className="text-xs font-black text-foreground tabular-nums mt-0.5">
                <AnimatedNumber value={r.effectiveNew} formatter={(v) => v.toFixed(2) + "%"} />
              </span>
            </div>
            <div className="flex flex-col border-l border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Effective Rate (Old)</span>
              <span className="text-xs font-black text-foreground tabular-nums mt-0.5">
                <AnimatedNumber value={r.effectiveOld} formatter={(v) => v.toFixed(2) + "%"} />
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Inputs Section */}
      <div className="space-y-6 bg-card/20 border border-border/50 rounded-3xl p-5">
        
        {/* Income Input */}
        <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
          <Label htmlFor="tax-income" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Annual Income
          </Label>
          <div className="flex items-center">
            <span className="text-lg font-bold text-muted-foreground mr-1.5">₹</span>
            <Input
              id="tax-income"
              type="text"
              inputMode="decimal"
              value={Number(inputs.income).toLocaleString("en-IN")}
              onChange={handleIncomeChange}
              className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-lg font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Deductions grid */}
        <div className="grid grid-cols-3 gap-4">
          
          <div className="relative pb-1 col-span-3 sm:col-span-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="tax-80c" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              80C Deductions
            </Label>
            <div className="flex items-center">
              <span className="text-xs font-bold text-muted-foreground mr-1">₹</span>
              <Input
                id="tax-80c"
                type="text"
                value={Number(inputs.deduction80C).toLocaleString("en-IN")}
                onChange={handle80CChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-sm font-black text-foreground focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="relative pb-1 col-span-3 sm:col-span-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="tax-80d" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              80D Medical
            </Label>
            <div className="flex items-center">
              <span className="text-xs font-bold text-muted-foreground mr-1">₹</span>
              <Input
                id="tax-80d"
                type="text"
                value={Number(inputs.deduction80D).toLocaleString("en-IN")}
                onChange={handle80DChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-sm font-black text-foreground focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="relative pb-1 col-span-3 sm:col-span-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="tax-hra" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              HRA Exemption
            </Label>
            <div className="flex items-center">
              <span className="text-xs font-bold text-muted-foreground mr-1">₹</span>
              <Input
                id="tax-hra"
                type="text"
                value={Number(inputs.hra).toLocaleString("en-IN")}
                onChange={handleHRAChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-sm font-black text-foreground focus-visible:ring-0"
              />
            </div>
          </div>

        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Annual Income Slider</span>
              <span className="text-foreground font-black tabular-nums">{formatINRFull(Number(inputs.income))}</span>
            </div>
            <Slider
              value={[Number(inputs.income)]}
              onValueChange={(vals) => handleIncomeSlider(vals[0])}
              min={250000}
              max={10000000}
              step={50000}
            />
          </div>
        </div>

      </div>

      {/* Dynamic Insights */}
      {insights.length > 0 && (
        <Card className="border border-primary/20 bg-primary/5 rounded-3xl p-4 flex gap-3 items-start">
          <span className="text-base leading-none select-none text-primary shrink-0 mt-0.5" aria-hidden="true">ⓘ</span>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-primary">{insights[0].title}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              {insights[0].description}
            </p>
          </div>
        </Card>
      )}

      {/* CTA Button Row */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          onClick={resetInputs}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-border/80 flex items-center justify-center shrink-0"
          title="Reset"
        >
          <span className="text-base leading-none select-none text-muted-foreground" aria-hidden="true">↺</span>
        </Button>
        <Button
          type="button"
          onClick={resetInputs}
          className="flex-1 rounded-full text-sm font-black h-12 bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md"
        >
          Reset Calculator
        </Button>
      </div>
    </div>
  );
}
