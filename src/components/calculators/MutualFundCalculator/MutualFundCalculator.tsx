/* src/components/calculators/MutualFundCalculator/MutualFundCalculator.tsx */

import * as React from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull } from "@/utils/formatters";
import { loanVsInvest } from "@/utils/calculations";
import { generateInsights } from "@/utils/insights";
import { logCalculatorUsage, formatINR } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedNumber } from "../AnimatedNumber";

const defaultInputs = { amount: 5000000, loanRate: 8.5, investRate: 12, years: 10, mode: "lump" };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const loanRate = Math.max(0, Number(inputs.loanRate) || 0);
  const investRate = Math.max(0, Number(inputs.investRate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const mode = String(inputs.mode || "lump");
  return loanVsInvest(amount, loanRate, investRate, years, mode);
}

export default function LoanVsInvestPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("loanvsinvest", defaultInputs, calcFn);
  const r = result as ReturnType<typeof calcFn> | null;

  // Track results history
  React.useEffect(() => {
    if (r) {
      const winner = r.netDifference >= 0 ? "Invest" : "Prepay";
      const summary = `${inputs.mode === 'sip' ? 'SIP' : 'Lump Sum'}: ${formatINR(Number(inputs.amount))}, Loan: ${inputs.loanRate}%, Invest: ${inputs.investRate}%, ${inputs.years} yrs`;
      logCalculatorUsage("loanvsinvest", `${winner} (+${formatINRFull(Math.abs(r.netDifference))})`, summary);
    }
  }, [r, inputs.mode, inputs.amount, inputs.loanRate, inputs.investRate, inputs.years]);

  const handleModeChange = (v: string) => {
    updateInput("mode", v);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
    updateInput("amount", val);
  };

  const handleLoanRateSlider = (val: number) => {
    updateInput("loanRate", val);
  };

  const handleInvestRateSlider = (val: number) => {
    updateInput("investRate", val);
  };

  const handleYearsSlider = (val: number) => {
    updateInput("years", val);
  };

  const insights = r ? generateInsights("loanvsinvest", r, inputs) : [];
  const winner = r && r.netDifference >= 0 ? "invest" : "repay";

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-base leading-none select-none text-primary font-black" aria-hidden="true">#</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Mutual Fund vs Loan</h2>
          <p className="text-xs text-muted-foreground">Compare loan prepayment vs investing in mutual funds</p>
        </div>
      </div>

      {/* Tabs for Mode */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Investment Mode
        </span>
        <Tabs value={String(inputs.mode || "lump")} onValueChange={handleModeChange}>
          <TabsList className="grid grid-cols-2 w-full bg-muted/50 border border-border/20 rounded-xl p-1 h-9">
            <TabsTrigger value="lump" className="text-[10px] font-black rounded-lg">LUMP SUM</TabsTrigger>
            <TabsTrigger value="sip" className="text-[10px] font-black rounded-lg">SIP</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Result Hero Card */}
      {r && (
        <Card className="border border-border bg-card/45 rounded-3xl overflow-hidden relative shadow-md">
          <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5 justify-center">
              {winner === "invest" ? (
                <>
                  <span className="text-base leading-none select-none text-emerald-400" aria-hidden="true">↑</span>
                  Winner: Investing Wins
                </>
              ) : (
                <>
                  <span className="text-base leading-none select-none text-primary" aria-hidden="true">⚠</span>
                  Winner: Loan Prepayment Wins
                </>
              )}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary tabular-nums">
              <AnimatedNumber value={Math.abs(r.netDifference)} formatter={formatINRFull} />
            </h1>
            <span className="text-[10px] text-muted-foreground mt-1.5 font-semibold">
              Net difference in financial gains
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 px-4 pb-5 pt-2 border-t border-border/50 text-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Final Investment Value</span>
              <span className="text-xs font-black text-emerald-400 tabular-nums mt-0.5">
                <AnimatedNumber value={r.finalInvestValue} formatter={formatINRFull} />
              </span>
            </div>
            <div className="flex flex-col border-l border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Total Loan Interest</span>
              <span className="text-xs font-black text-rose-400 tabular-nums mt-0.5">
                <AnimatedNumber value={r.totalInterest} formatter={formatINRFull} />
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Inputs Section */}
      <div className="space-y-6 bg-card/20 border border-border/50 rounded-3xl p-5">
        
        {/* Amount Input */}
        <div className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 focus-within:after:w-full after:transition-all after:duration-300 after:h-[2px] after:bg-primary">
          <Label htmlFor="lvi-amount" className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            {String(inputs.mode) === "sip" ? "Monthly Investment Amount" : "Loan Outstanding Principal"}
          </Label>
          <div className="flex items-center">
            <span className="text-lg font-bold text-muted-foreground mr-1.5">₹</span>
            <Input
              id="lvi-amount"
              type="text"
              inputMode="decimal"
              value={Number(inputs.amount).toLocaleString("en-IN")}
              onChange={handleAmountChange}
              className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 pb-1 h-auto text-lg font-black text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2">
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Loan Interest Rate</span>
              <span className="text-foreground font-black tabular-nums">{String(inputs.loanRate)}% P.A.</span>
            </div>
            <Slider
              value={[Number(inputs.loanRate)]}
              onValueChange={(vals) => handleLoanRateSlider(vals[0])}
              min={1}
              max={20}
              step={0.1}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Expected Investment Return</span>
              <span className="text-foreground font-black tabular-nums">{String(inputs.investRate)}% P.A.</span>
            </div>
            <Slider
              value={[Number(inputs.investRate)]}
              onValueChange={(vals) => handleInvestRateSlider(vals[0])}
              min={1}
              max={30}
              step={0.5}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Duration Period</span>
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
