/* src/components/calculators/SIPCalculator/SIPCalculator.tsx */

import * as React from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { sipFV } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { logCalculatorUsage, formatINR } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedNumber } from "../AnimatedNumber";

const defaultInputs = { amount: 5000, years: 10, rate: 12, stepUp: "0" };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const stepUp = Math.max(0, Number(inputs.stepUp) || 0) / 100;
  const months = years * 12;

  let maturity: number;
  let invested: number;
  if (stepUp === 0) {
    maturity = sipFV(amount, months, rate);
    invested = amount * months;
  } else {
    let totalFV = 0;
    invested = 0;
    let monthlyAmount = amount;
    const r = rate / 12 / 100;
    for (let y = 0; y < years; y++) {
      const fvYearEnd = sipFV(monthlyAmount, 12, rate);
      const monthsAfter = (years - y - 1) * 12;
      totalFV += fvYearEnd * (r > 0 ? Math.pow(1 + r, monthsAfter) : 1);
      invested += monthlyAmount * 12;
      monthlyAmount *= (1 + stepUp);
    }
    maturity = Math.round(totalFV);
  }

  const returns = Math.max(0, maturity - invested);
  return {
    maturity: Math.round(maturity),
    invested: Math.round(invested),
    returns: Math.round(returns),
    growthPct: invested > 0 ? ((returns / invested) * 100) : 0,
  };
}

export default function SIPPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("sip", defaultInputs, calcFn);
  const r = result as ReturnType<typeof calcFn> | null;

  // Track results history
  React.useEffect(() => {
    if (r) {
      const summary = `Monthly: ${formatINR(Number(inputs.amount))}, Return: ${inputs.rate}%, Tenure: ${inputs.years} yrs${Number(inputs.stepUp) > 0 ? `, Step-up: ${inputs.stepUp}%` : ""}`;
      logCalculatorUsage("sip", formatINRFull(r.maturity), summary);
    }
  }, [r, inputs.amount, inputs.rate, inputs.years, inputs.stepUp]);



  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("amount", val);
  };

  const handleYearsSlider = (val: number) => {
    updateInput("years", val);
  };

  const handleRateSlider = (val: number) => {
    updateInput("rate", val);
  };

  const handleStepUpChange = (val: string) => {
    updateInput("stepUp", val);
  };

  const insights = r ? generateInsights("sip", r, inputs) : [];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-base leading-none select-none text-primary font-black" aria-hidden="true">₿</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">SIP Calculator</h2>
          <p className="text-xs text-muted-foreground">Estimate systematic investment plan returns</p>
        </div>
      </div>

      {/* Result Hero Card */}
      {r && (
        <Card className="border border-border bg-card/45 rounded-3xl overflow-hidden relative shadow-md">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Estimated Maturity Value
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary tabular-nums">
              <AnimatedNumber value={r.maturity} formatter={formatINRFull} />
            </h1>
            <span className="text-[10px] text-muted-foreground mt-1.5 font-medium">
              Based on monthly compounding returns
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 pb-5 pt-2 border-t border-border/50 text-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Invested</span>
              <span className="text-xs font-black text-foreground tabular-nums mt-0.5">
                <AnimatedNumber value={r.invested} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col border-x border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Est. Returns</span>
              <span className="text-xs font-black text-emerald-400 tabular-nums mt-0.5">
                <AnimatedNumber value={r.returns} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Growth Rate</span>
              <span className="text-xs font-black text-primary tabular-nums mt-0.5">
                <AnimatedNumber value={r.growthPct} formatter={(v) => v.toFixed(1) + "%"} />
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Inputs Section */}
      <div className="space-y-6 bg-card/20 border border-border/50 rounded-3xl p-5">
        {/* Monthly Investment Input */}
        <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
          <Label htmlFor="sip-amount" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Monthly Investment
          </Label>
          <div className="flex items-center">
            <span className="text-lg font-bold text-muted-foreground mr-1.5">₹</span>
            <Input
              id="sip-amount"
              type="text"
              inputMode="decimal"
              value={Number(inputs.amount).toLocaleString("en-IN")}
              onChange={handleAmountChange}
              className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-lg font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        {/* Investment Period Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Investment Duration
            </span>
            <span className="text-sm font-black text-foreground tabular-nums">
              {String(inputs.years)} YRS
            </span>
          </div>
          <Slider
            value={[Number(inputs.years)]}
            onValueChange={(vals) => handleYearsSlider(vals[0])}
            min={1}
            max={40}
            step={1}
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
            <span>1 YR</span>
            <span>40 YRS</span>
          </div>
        </div>

        {/* Return Rate Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Expected Annual Return
            </span>
            <span className="text-sm font-black text-foreground tabular-nums">
              {String(inputs.rate)}%
            </span>
          </div>
          <Slider
            value={[Number(inputs.rate)]}
            onValueChange={(vals) => handleRateSlider(vals[0])}
            min={1}
            max={30}
            step={0.5}
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
            <span>1% P.A.</span>
            <span>30% P.A.</span>
          </div>
        </div>

        {/* Step-up Option */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Annual Step-up Percentage
          </span>
          <Tabs value={String(inputs.stepUp || "0")} onValueChange={handleStepUpChange}>
            <TabsList className="grid grid-cols-5 w-full bg-muted/50 border border-border/20 rounded-xl p-1 h-9">
              <TabsTrigger value="0" className="text-[10px] font-black rounded-lg">OFF</TabsTrigger>
              <TabsTrigger value="5" className="text-[10px] font-black rounded-lg">5%</TabsTrigger>
              <TabsTrigger value="10" className="text-[10px] font-black rounded-lg">10%</TabsTrigger>
              <TabsTrigger value="15" className="text-[10px] font-black rounded-lg">15%</TabsTrigger>
              <TabsTrigger value="20" className="text-[10px] font-black rounded-lg">20%</TabsTrigger>
            </TabsList>
          </Tabs>
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
