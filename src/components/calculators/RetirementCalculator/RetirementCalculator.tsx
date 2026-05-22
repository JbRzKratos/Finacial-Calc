/* src/components/calculators/RetirementCalculator/RetirementCalculator.tsx */

import * as React from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { retirementCorpus } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { logCalculatorUsage, formatINR } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AnimatedNumber } from "../AnimatedNumber";
import { TimelineBar } from "@/components/common/TimelineBar/TimelineBar";

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

  // Track results history
  React.useEffect(() => {
    if (r) {
      logCalculatorUsage(
        "retirement",
        formatINRFull(r.corpus),
        `Expense/mo: ${formatINR(Number(inputs.monthlyExpense))}, Age: ${inputs.currentAge} → ${inputs.retirementAge}, Return: ${inputs.returns}%`
      );
    }
  }, [r, inputs.monthlyExpense, inputs.currentAge, inputs.retirementAge, inputs.returns]);

  const handleCurrentAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 1;
    updateInput("currentAge", val);
  };

  const handleRetirementAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 1;
    updateInput("retirementAge", val);
  };

  const handleLifeExpectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 1;
    updateInput("lifeExpectancy", val);
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("monthlyExpense", val);
  };

  const handleInflationSlider = (val: number) => {
    updateInput("inflation", val);
  };

  const handleReturnsSlider = (val: number) => {
    updateInput("returns", val);
  };

  const insights = r ? generateInsights("retirement", r, inputs) : [];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-base leading-none select-none text-primary font-bold" aria-hidden="true">◷</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Retirement Planner</h2>
          <p className="text-xs text-muted-foreground">Estimate target corpus and required monthly savings</p>
        </div>
      </div>

      {/* Result Hero Card */}
      {r && (
        <Card className="border border-border bg-card/45 rounded-3xl overflow-hidden relative shadow-md">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Required Retirement Corpus
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary tabular-nums">
              <AnimatedNumber value={r.corpus} formatter={formatINRFull} />
            </h1>
            <span className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Adjusted for future inflation rates
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 pb-5 pt-2 border-t border-border/50 text-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Future Expense</span>
              <span className="text-xs font-black text-foreground tabular-nums mt-0.5">
                <AnimatedNumber value={r.fme} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col border-x border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Monthly SIP</span>
              <span className="text-xs font-black text-emerald-400 tabular-nums mt-0.5">
                <AnimatedNumber value={r.monthlySip} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Years to Retire</span>
              <span className="text-xs font-black text-primary tabular-nums mt-0.5">
                <AnimatedNumber value={r.yearsToRetire} formatter={(v) => v + " yrs"} />
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Inputs Section */}
      <div className="space-y-6 bg-card/20 border border-border/50 rounded-3xl p-5">
        
        {/* Profile Details Inputs */}
        <div className="grid grid-cols-3 gap-4">
          
          <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="ret-curr-age" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Current Age
            </Label>
            <div className="flex items-center">
              <Input
                id="ret-curr-age"
                type="number"
                value={inputs.currentAge as string | number}
                onChange={handleCurrentAgeChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-base font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <span className="text-xs font-bold text-muted-foreground ml-1">Yr</span>
            </div>
          </div>

          <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="ret-ret-age" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Retire Age
            </Label>
            <div className="flex items-center">
              <Input
                id="ret-ret-age"
                type="number"
                value={inputs.retirementAge as string | number}
                onChange={handleRetirementAgeChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-base font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <span className="text-xs font-bold text-muted-foreground ml-1">Yr</span>
            </div>
          </div>

          <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="ret-life-expect" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Life Expect
            </Label>
            <div className="flex items-center">
              <Input
                id="ret-life-expect"
                type="number"
                value={inputs.lifeExpectancy as string | number}
                onChange={handleLifeExpectChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-base font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <span className="text-xs font-bold text-muted-foreground ml-1">Yr</span>
            </div>
          </div>

        </div>

        {/* Expenses Input */}
        <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
          <Label htmlFor="ret-expenses" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Monthly Expenses (Today)
          </Label>
          <div className="flex items-center">
            <span className="text-lg font-bold text-muted-foreground mr-1.5">₹</span>
            <Input
              id="ret-expenses"
              type="text"
              inputMode="decimal"
              value={Number(inputs.monthlyExpense).toLocaleString("en-IN")}
              onChange={handleExpenseChange}
              className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-lg font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2">
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Inflation Rate</span>
              <span className="text-foreground font-black tabular-nums">{String(inputs.inflation)}%</span>
            </div>
            <Slider
              value={[Number(inputs.inflation)]}
              onValueChange={(vals) => handleInflationSlider(vals[0])}
              min={1}
              max={15}
              step={0.5}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Expected Investment Return</span>
              <span className="text-foreground font-black tabular-nums">{String(inputs.returns)}% P.A.</span>
            </div>
            <Slider
              value={[Number(inputs.returns)]}
              onValueChange={(vals) => handleReturnsSlider(vals[0])}
              min={1}
              max={20}
              step={0.5}
            />
          </div>

        </div>

      </div>

      {/* Profile Lifespan timeline visual bar */}
      {r && (
        <div className="px-1.5">
          <TimelineBar
            currentAge={Number(inputs.currentAge) || 30}
            retirementAge={Number(inputs.retirementAge) || 60}
            lifeExpectancy={Number(inputs.lifeExpectancy) || 85}
          />
        </div>
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
          className="flex-1 rounded-full text-sm font-black h-12 bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/20"
        >
          Reset Calculator
        </Button>
      </div>
    </div>
  );
}
