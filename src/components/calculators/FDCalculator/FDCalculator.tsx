/* src/components/calculators/FDCalculator/FDCalculator.tsx */

import * as React from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { fdMaturity, rdMaturity } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { logCalculatorUsage, formatINR } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedNumber } from "../AnimatedNumber";

const compoundingOptions = [
  { value: "simple", label: "SIMPLE" },
  { value: "yearly", label: "YEARLY" },
  { value: "quarterly", label: "QUARTER" },
  { value: "monthly", label: "MONTHLY" },
];

const defaultInputs = {
  depositType: "fd",
  amount: 100000,
  rate: 7.5,
  years: 3,
  compounding: "quarterly",
};

function calcFn(inputs: Record<string, unknown>) {
  const depositType = String(inputs.depositType || "fd");
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const compounding = String(inputs.compounding || "quarterly");

  let maturity: number;
  let totalInvested: number;
  if (depositType === "rd") {
    maturity = rdMaturity(amount, rate, years);
    totalInvested = amount * years * 12;
  } else {
    maturity = fdMaturity(amount, rate, years, compounding);
    totalInvested = amount;
  }
  const totalInterest = Math.max(0, maturity - totalInvested);
  return {
    maturity: Math.round(maturity),
    totalInterest: Math.round(totalInterest),
    amount: Math.round(totalInvested),
    depositType,
    returnsPct: totalInvested > 0 ? (totalInterest / totalInvested) * 100 : 0,
  };
}

export default function FDPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("fd", defaultInputs, calcFn);
  const r = result as ReturnType<typeof calcFn> | null;

  // Track results history
  React.useEffect(() => {
    if (r) {
      const typeLabel = String(inputs.depositType).toUpperCase();
      const summary = `${typeLabel}: ${formatINR(Number(inputs.amount))}, Rate: ${inputs.rate}%, Tenure: ${inputs.years} yrs`;
      logCalculatorUsage("fd", formatINRFull(r.maturity), summary);
    }
  }, [r, inputs.depositType, inputs.amount, inputs.rate, inputs.years]);

  const handleDepositTypeChange = (v: string) => {
    updateInput("depositType", v);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("amount", val);
  };

  const handleRateSlider = (val: number) => {
    updateInput("rate", val);
  };

  const handleYearsSlider = (val: number) => {
    updateInput("years", val);
  };

  const handleCompoundingChange = (v: string) => {
    updateInput("compounding", v);
  };

  const insights = r ? generateInsights("fd", r, inputs) : [];

  const isRD = String(inputs.depositType) === "rd";

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-base leading-none select-none text-primary font-black" aria-hidden="true">↑</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">FD / RD Calculator</h2>
          <p className="text-xs text-muted-foreground">Calculate Fixed and Recurring Deposit earnings</p>
        </div>
      </div>

      {/* Tabs for FD vs RD */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Select Deposit Type
        </span>
        <Tabs value={String(inputs.depositType || "fd")} onValueChange={handleDepositTypeChange}>
          <TabsList className="grid grid-cols-2 w-full bg-muted/50 border border-border/20 rounded-xl p-1 h-9">
            <TabsTrigger value="fd" className="text-[10px] font-black rounded-lg">FIXED DEPOSIT</TabsTrigger>
            <TabsTrigger value="rd" className="text-[10px] font-black rounded-lg">RECURRING DEPOSIT</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Result Hero Card */}
      {r && (
        <Card className="border border-border bg-card/45 rounded-3xl overflow-hidden relative shadow-md">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Maturity Value
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary tabular-nums">
              <AnimatedNumber value={r.maturity} formatter={formatINRFull} />
            </h1>
            <span className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Principal + Interest Earned
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 pb-5 pt-2 border-t border-border/50 text-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Invested</span>
              <span className="text-xs font-black text-foreground tabular-nums mt-0.5">
                <AnimatedNumber value={r.amount} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col border-x border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Est. Interest</span>
              <span className="text-xs font-black text-emerald-400 tabular-nums mt-0.5">
                <AnimatedNumber value={r.totalInterest} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Returns Pct</span>
              <span className="text-xs font-black text-primary tabular-nums mt-0.5">
                <AnimatedNumber value={r.returnsPct} formatter={(v) => v.toFixed(1) + "%"} />
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Inputs Section */}
      <div className="space-y-6 bg-card/20 border border-border/50 rounded-3xl p-5">
        
        {/* Deposit Amount Input */}
        <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
          <Label htmlFor="fd-amount" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            {isRD ? "Monthly Installment" : "Principal Amount"}
          </Label>
          <div className="flex items-center">
            <span className="text-lg font-bold text-muted-foreground mr-1.5">₹</span>
            <Input
              id="fd-amount"
              type="text"
              inputMode="decimal"
              value={Number(inputs.amount).toLocaleString("en-IN")}
              onChange={handleAmountChange}
              className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-lg font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Return Rate Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Interest Rate (P.A.)
            </span>
            <span className="text-sm font-black text-foreground tabular-nums">
              {String(inputs.rate)}%
            </span>
          </div>
          <Slider
            value={[Number(inputs.rate)]}
            onValueChange={(vals) => handleRateSlider(vals[0])}
            min={1}
            max={15}
            step={0.1}
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
            <span>1% P.A.</span>
            <span>15% P.A.</span>
          </div>
        </div>

        {/* Investment Period Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Tenure duration
            </span>
            <span className="text-sm font-black text-foreground tabular-nums">
              {String(inputs.years)} YRS
            </span>
          </div>
          <Slider
            value={[Number(inputs.years)]}
            onValueChange={(vals) => handleYearsSlider(vals[0])}
            min={1}
            max={30}
            step={1}
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
            <span>1 YR</span>
            <span>30 YRS</span>
          </div>
        </div>

        {/* Compounding Option for FD */}
        {!isRD && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Compounding Frequency
            </span>
            <Tabs value={String(inputs.compounding || "quarterly")} onValueChange={handleCompoundingChange}>
              <TabsList className="grid grid-cols-4 w-full bg-muted/50 border border-border/20 rounded-xl p-1 h-9">
                {compoundingOptions.map((opt) => (
                  <TabsTrigger key={opt.value} value={opt.value} className="text-[10px] font-black rounded-lg">
                    {opt.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
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
