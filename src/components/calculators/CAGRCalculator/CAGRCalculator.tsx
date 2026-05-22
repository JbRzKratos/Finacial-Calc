/* src/components/calculators/CAGRCalculator/CAGRCalculator.tsx */

import * as React from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { cagr, ruleOf72 } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { logCalculatorUsage, formatINR } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "../AnimatedNumber";

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
  const r = result as ReturnType<typeof calcFn> | null;

  // Track results history
  React.useEffect(() => {
    if (r) {
      logCalculatorUsage(
        "cagr",
        r.cagr.toFixed(2) + "%",
        `Initial: ${formatINR(Number(inputs.initial))}, Final: ${formatINR(Number(inputs.final))}, Tenure: ${inputs.years} yrs`
      );
    }
  }, [r, inputs.initial, inputs.final, inputs.years]);

  const handleInitialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("initial", val);
  };

  const handleFinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("final", val);
  };

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 1;
    updateInput("years", val);
  };

  const handleInitialSlider = (val: number) => {
    updateInput("initial", val);
  };

  const handleFinalSlider = (val: number) => {
    updateInput("final", val);
  };

  const handleYearsSlider = (val: number) => {
    updateInput("years", val);
  };

  const benchmarkKey = String(inputs.benchmark || "nifty");
  const benchmarkRate = benchmarkMap[benchmarkKey] ?? 12;
  const selectedBenchmark = benchmarkNames[benchmarkKey] || "Nifty 50";
  const outperformance = r ? r.cagr - benchmarkRate : 0;

  const insights = r ? generateInsights("cagr", r, inputs) : [];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-base leading-none select-none text-primary font-bold" aria-hidden="true">%</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">CAGR Calculator</h2>
          <p className="text-xs text-muted-foreground">Compute Compound Annual Growth Rate</p>
        </div>
      </div>

      {/* Result Hero Card */}
      {r && (
        <Card className="border border-border bg-card/45 rounded-3xl overflow-hidden relative shadow-md">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Compound Annual Growth Rate
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary tabular-nums">
              <AnimatedNumber value={r.cagr} formatter={(v) => v.toFixed(2) + "%"} />
            </h1>
            <span className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Annualized return percentage
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 pb-5 pt-2 border-t border-border/50 text-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Abs. Return</span>
              <span className="text-xs font-black text-emerald-400 tabular-nums mt-0.5">
                <AnimatedNumber value={r.absReturn} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col border-x border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Total Growth</span>
              <span className="text-xs font-black text-foreground tabular-nums mt-0.5">
                <AnimatedNumber value={r.initial > 0 ? (r.absReturn / r.initial * 100) : 0} formatter={(v) => v.toFixed(1) + "%"} />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Double Period</span>
              <span className="text-xs font-black text-primary tabular-nums mt-0.5">
                <AnimatedNumber value={r.doubleYears} formatter={(v) => v + " yrs"} />
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Inputs Section */}
      <div className="space-y-6 bg-card/20 border border-border/50 rounded-3xl p-5">
        
        {/* CAGR Inputs Grid */}
        <div className="grid grid-cols-3 gap-4">
          
          <div className="relative pb-1 col-span-3 sm:col-span-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="cagr-initial" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Initial Investment
            </Label>
            <div className="flex items-center">
              <span className="text-sm font-bold text-muted-foreground mr-1">₹</span>
              <Input
                id="cagr-initial"
                type="text"
                inputMode="decimal"
                value={Number(inputs.initial).toLocaleString("en-IN")}
                onChange={handleInitialChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-base font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="relative pb-1 col-span-3 sm:col-span-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="cagr-final" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Final Value
            </Label>
            <div className="flex items-center">
              <span className="text-sm font-bold text-muted-foreground mr-1">₹</span>
              <Input
                id="cagr-final"
                type="text"
                inputMode="decimal"
                value={Number(inputs.final).toLocaleString("en-IN")}
                onChange={handleFinalChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-base font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="relative pb-1 col-span-3 sm:col-span-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="cagr-years" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Tenure Years
            </Label>
            <div className="flex items-center">
              <Input
                id="cagr-years"
                type="number"
                step="1"
                value={inputs.years as string | number}
                onChange={handleYearsChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-base font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <span className="text-sm font-bold text-muted-foreground ml-1">Yr</span>
            </div>
          </div>

        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2">
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Initial Investment Slider</span>
              <span className="text-foreground font-black tabular-nums">{formatINRFull(Number(inputs.initial))}</span>
            </div>
            <Slider
              value={[Number(inputs.initial)]}
              onValueChange={(vals) => handleInitialSlider(vals[0])}
              min={1000}
              max={10000000}
              step={1000}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Final Value Slider</span>
              <span className="text-foreground font-black tabular-nums">{formatINRFull(Number(inputs.final))}</span>
            </div>
            <Slider
              value={[Number(inputs.final)]}
              onValueChange={(vals) => handleFinalSlider(vals[0])}
              min={1000}
              max={50000000}
              step={1000}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Tenure Slider</span>
              <span className="text-foreground font-black tabular-nums">{String(inputs.years)} YRS</span>
            </div>
            <Slider
              value={[Number(inputs.years)]}
              onValueChange={(vals) => handleYearsSlider(vals[0])}
              min={1}
              max={30}
              step={1}
            />
          </div>

        </div>

      </div>

      {/* Outperformance vs Nifty Badge */}
      {r && (
        <Card className="border border-border bg-card/45 p-4 rounded-3xl flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Benchmark comparison</span>
            <span className="text-xs font-bold text-foreground">vs {selectedBenchmark} ({benchmarkRate}%)</span>
          </div>
          <Badge className={outperformance >= 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs font-black px-2.5 py-1" : "bg-rose-500/10 text-rose-400 border-rose-500/20 text-xs font-black px-2.5 py-1"}>
            {outperformance >= 0 ? "+" : ""}{outperformance.toFixed(2)}% CAGR diff
          </Badge>
        </Card>
      )}

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
