"use client";

import { useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINRFull, formatINR } from "@/lib/formatter";
import { retirementCorpus } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { InputSlider } from "@/components/calculator/InputSlider";
import { ResultCard } from "@/components/calculator/ResultCard";
import { InsightCard } from "@/components/calculator/InsightCard";
import { CalcChart } from "@/components/calculator/CalcChart";
import { ResetCopyBar } from "@/components/calculator/ResetCopyBar";
import { Button } from "@/components/ui/button";
import { CalcIcon } from "@/components/shared/CalcIcon";
import { cn } from "@/lib/utils";

const defaultInputs = { currentAge: 30, retirementAge: 60, lifeExpectancy: 85, monthlyExpense: 50000, inflation: 6, investReturn: 10 };

function calcFn(inputs: Record<string, unknown>) {
  const currentAge = Math.max(18, Math.min(55, Number(inputs.currentAge) || 30));
  const retirementAge = Math.max(currentAge + 1, Number(inputs.retirementAge) || 60);
  const lifeExpectancy = Math.max(retirementAge + 1, Number(inputs.lifeExpectancy) || 85);
  const monthlyExpense = Math.max(0, Number(inputs.monthlyExpense) || 0);
  const inflation = Math.max(0, Number(inputs.inflation) || 0);
  const investReturn = Math.max(0, Number(inputs.investReturn) || 0);
  return retirementCorpus(monthlyExpense, inflation, currentAge, retirementAge, lifeExpectancy, investReturn);
}

export default function RetirementPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("retirement", defaultInputs, calcFn);
  const [step, setStep] = useState(1);

  const r = result as ReturnType<typeof calcFn> | null;

  const chartConfig = r ? {
    type: "line" as const,
    data: {
      labels: ["Now", `Age ${inputs.retirementAge as number} (Retire)`, `Age ${inputs.lifeExpectancy as number}`],
      datasets: [{
        label: "Corpus Needed",
        data: [0, r.corpus, 0],
        borderColor: "#818cf8",
        backgroundColor: "rgba(129,140,248,0.1)",
        fill: true,
      }]
    }
  } : null;

  const insights = r ? generateInsights("retirement", r, inputs) : [];

  const stepLabels = ["About You", "Your Lifestyle", "Investment Plan"];

  const nextStep = () => setStep(s => Math.min(3, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const corpusCr = r ? (r.corpus / 10000000).toFixed(2) : "0";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold flex items-center gap-2"><CalcIcon name="🎯" className="w-5 h-5" /> Retirement Planner</h2>
        <p className="text-sm text-muted-foreground">Your future, sorted — plan your retirement corpus</p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Future Planning</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Retirement Corpus</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-1"><CalcIcon name="🏷️" className="w-3 h-3" />Monthly Savings</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Step {step} of 3: {stepLabels[step - 1]}</p>
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn("flex-1 h-1.5 rounded-full transition-colors", s <= step ? "bg-calc-accent" : "bg-muted")} />
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {step === 1 && (
          <>
            <InputSlider id="ret-currentAge" label="Current Age" icon="👤" value={Number(inputs.currentAge)} min={18} max={55} step={1} unit="yr" unitPosition="suffix" formatValue={(v) => `${v} yrs`} helperText="How old are you today?" onChange={(v) => { updateInput("currentAge", v); if (v >= Number(inputs.retirementAge)) updateInput("retirementAge", Math.min(v + 1, 80)); }} />

            <InputSlider id="ret-retirementAge" label="Retirement Age" icon="🎯" value={Number(inputs.retirementAge)} min={Math.max(Number(inputs.currentAge) + 1, 40)} max={80} step={1} unit="yr" unitPosition="suffix" formatValue={(v) => `${v} yrs`} helperText="At what age do you plan to retire?" onChange={(v) => { updateInput("retirementAge", v); if (v <= Number(inputs.currentAge)) updateInput("currentAge", Math.max(18, v - 1)); }} />

            <InputSlider id="ret-lifeExpectancy" label="Life Expectancy" icon="❤️" value={Number(inputs.lifeExpectancy)} min={Math.max(Number(inputs.retirementAge) + 1, 60)} max={100} step={1} unit="yr" unitPosition="suffix" formatValue={(v) => `${v} yrs`} helperText="We'll plan your money to last this long" onChange={(v) => updateInput("lifeExpectancy", v)} />
          </>
        )}

        {step === 2 && (
          <>
            <InputSlider id="ret-monthlyExpense" label="Monthly Expenses Today" icon="💳" value={Number(inputs.monthlyExpense)} min={5000} max={500000} step={5000} unit="₹" unitPosition="prefix" formatValue={(v) => formatINR(v)} helperText="Include rent, food, bills — everything" onChange={(v) => updateInput("monthlyExpense", v)} />
          </>
        )}

        {step === 3 && (
          <>
            <InputSlider id="ret-inflation" label="Expected Inflation" icon="📈" value={Number(inputs.inflation)} min={0} max={20} step={0.5} unit="%" unitPosition="suffix" formatValue={(v) => `${v}%`} helperText="Prices rise ~6% per year in India" onChange={(v) => updateInput("inflation", v)} />

            <InputSlider id="ret-investReturn" label="Expected Return on Investment" icon="📊" value={Number(inputs.investReturn)} min={1} max={20} step={0.5} unit="%" unitPosition="suffix" formatValue={(v) => `${v}%`} helperText="Conservative 8%, Balanced 10%, Aggressive 12%" onChange={(v) => updateInput("investReturn", v)} />
          </>
        )}
      </div>

      <div className="flex gap-2">
        {step > 1 && <Button variant="outline" onClick={prevStep}>← Back</Button>}
        {step < 3 && <Button onClick={nextStep}>Next →</Button>}
        {step === 3 && (
          <ResetCopyBar onReset={() => { resetInputs(); setStep(1); }} summaryObj={r ? { Calculator: "Retirement", "Monthly Expense": formatINR(Number(inputs.monthlyExpense)), "Retirement Age": `${inputs.retirementAge}`, "Corpus Needed": `₹${corpusCr} Cr`, "Monthly SIP": formatINRFull(r.monthlySip) } : undefined} />
        )}
      </div>

      {r && step === 3 && (
        <>
          <ResultCard
            heroLabel={`You need ₹${corpusCr} Crores to retire comfortably`}
            heroValue={formatINRFull(r.corpus)}
            heroVariant="accent"
            metrics={[
              { label: "Monthly SIP Needed", value: formatINRFull(r.monthlySip), variant: "accent" },
              { label: "Monthly Expense at Retire", value: formatINRFull(r.fme) },
              { label: "Years to Retire", value: `${r.yearsToRetire} yrs` },
            ]}
            summary={`Start saving ${formatINRFull(r.monthlySip)}/month today. At age ${inputs.retirementAge as number}, your monthly expense will be ${formatINRFull(r.fme)}. Your corpus of ${formatINRFull(r.corpus)} will last until age ${inputs.lifeExpectancy as number}.`}
          />

          <InsightCard insights={insights} />

          {chartConfig && (
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">RETIREMENT TIMELINE</h3>
              <CalcChart config={chartConfig} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
