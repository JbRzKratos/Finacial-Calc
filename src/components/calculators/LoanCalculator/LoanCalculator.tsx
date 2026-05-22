/* src/components/calculators/LoanCalculator/LoanCalculator.tsx */

import * as React from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { emi } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { logCalculatorUsage, formatINR } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedNumber } from "../AnimatedNumber";

const loanPresets = [
  { value: "home", label: "HOME" },
  { value: "car", label: "CAR" },
  { value: "edu", label: "EDUCATION" },
  { value: "other", label: "PERSONAL" },
];

const presetMap: Record<string, { amount: number; rate: number; years: number }> = {
  home: { amount: 5000000, rate: 8.5, years: 20 },
  car: { amount: 800000, rate: 9, years: 5 },
  edu: { amount: 1000000, rate: 8, years: 10 },
  other: { amount: 500000, rate: 12, years: 3 },
};

const defaultInputs = { amount: 5000000, rate: 8.5, years: 20, preset: "home" };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const months = years * 12;
  const emiAmt = emi(amount, rate, months);
  const totalPayment = emiAmt * months;
  const totalInterest = totalPayment - amount;
  return {
    emi: Math.round(emiAmt),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    amount: Math.round(amount),
    months,
    interestRatio: totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0,
  };
}

export default function EMIPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("emi", defaultInputs, calcFn);
  const r = result as ReturnType<typeof calcFn> | null;

  // Track results history
  React.useEffect(() => {
    if (r) {
      const summary = `Loan: ${formatINR(Number(inputs.amount))}, Rate: ${inputs.rate}%, Tenure: ${inputs.years} yrs`;
      logCalculatorUsage("emi", formatINRFull(r.emi) + "/mo", summary);
    }
  }, [r, inputs.amount, inputs.rate, inputs.years]);

  const applyPreset = (preset: string) => {
    const p = presetMap[preset];
    if (p) {
      updateInput("amount", p.amount);
      updateInput("rate", p.rate);
      updateInput("years", p.years);
      updateInput("preset", preset);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("amount", val);
    updateInput("preset", "other");
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    updateInput("rate", val);
    updateInput("preset", "other");
  };

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 1;
    updateInput("years", val);
    updateInput("preset", "other");
  };

  const handleAmountSlider = (val: number) => {
    updateInput("amount", val);
    updateInput("preset", "other");
  };

  const handleRateSlider = (val: number) => {
    updateInput("rate", val);
    updateInput("preset", "other");
  };

  const handleYearsSlider = (val: number) => {
    updateInput("years", val);
    updateInput("preset", "other");
  };

  const insights = r ? generateInsights("emi", r, inputs) : [];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-base leading-none select-none text-primary font-black" aria-hidden="true">$</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">EMI Calculator</h2>
          <p className="text-xs text-muted-foreground">Calculate monthly installments on loans</p>
        </div>
      </div>

      {/* Preset Loan Selection */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Select Loan Category
        </span>
        <Tabs value={String(inputs.preset || "home")} onValueChange={applyPreset}>
          <TabsList className="grid grid-cols-4 w-full bg-muted/50 border border-border/20 rounded-xl p-1 h-9">
            {loanPresets.map((p) => (
              <TabsTrigger key={p.value} value={p.value} className="text-[10px] font-black rounded-lg">
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Result Hero Card */}
      {r && (
        <Card className="border border-border bg-card/45 rounded-3xl overflow-hidden relative shadow-md">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Monthly EMI Amount
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary tabular-nums">
              <AnimatedNumber value={r.emi} formatter={formatINRFull} />
            </h1>
            <span className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Equated Monthly Installment
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 pb-5 pt-2 border-t border-border/50 text-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Principal</span>
              <span className="text-xs font-black text-foreground tabular-nums mt-0.5">
                <AnimatedNumber value={r.amount} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col border-x border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Interest Paid</span>
              <span className="text-xs font-black text-rose-400 tabular-nums mt-0.5">
                <AnimatedNumber value={r.totalInterest} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Total Repay</span>
              <span className="text-xs font-black text-primary tabular-nums mt-0.5">
                <AnimatedNumber value={r.totalPayment} formatter={formatINRFull} />
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Inputs Section */}
      <div className="space-y-6 bg-card/20 border border-border/50 rounded-3xl p-5">
        
        {/* Loan Details Grid Inputs */}
        <div className="grid grid-cols-3 gap-4">
          
          <div className="relative pb-1 col-span-3 sm:col-span-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="emi-amount" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Loan Principal
            </Label>
            <div className="flex items-center">
              <span className="text-sm font-bold text-muted-foreground mr-1">₹</span>
              <Input
                id="emi-amount"
                type="text"
                inputMode="decimal"
                value={Number(inputs.amount).toLocaleString("en-IN")}
                onChange={handleAmountChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-base font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="emi-rate" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Interest Rate
            </Label>
            <div className="flex items-center">
              <Input
                id="emi-rate"
                type="number"
                step="0.1"
                value={inputs.rate as string | number}
                onChange={handleRateChange}
                className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-base font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <span className="text-sm font-bold text-muted-foreground ml-1">%</span>
            </div>
          </div>

          <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
            <Label htmlFor="emi-years" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              Tenure Years
            </Label>
            <div className="flex items-center">
              <Input
                id="emi-years"
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
              <span>Principal Slider</span>
              <span className="text-foreground font-black tabular-nums">{formatINRFull(Number(inputs.amount))}</span>
            </div>
            <Slider
              value={[Number(inputs.amount)]}
              onValueChange={(vals) => handleAmountSlider(vals[0])}
              min={10000}
              max={10000000}
              step={10000}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Interest Rate Slider</span>
              <span className="text-foreground font-black tabular-nums">{String(inputs.rate)}%</span>
            </div>
            <Slider
              value={[Number(inputs.rate)]}
              onValueChange={(vals) => handleRateSlider(vals[0])}
              min={1}
              max={20}
              step={0.1}
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
          onClick={resetInputs}
          variant="outline"
          size="icon"
          type="button"
          className="w-12 h-12 rounded-full border-border/80 flex items-center justify-center shrink-0"
          title="Reset"
        >
          <span className="text-base leading-none select-none text-muted-foreground" aria-hidden="true">↺</span>
        </Button>
        <Button
          onClick={resetInputs}
          type="button"
          className="flex-1 rounded-full text-sm font-black h-12 bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/20"
        >
          Reset Calculator
        </Button>
      </div>
    </div>
  );
}
