"use client";

import { useCalculator } from "@/features/finance-calc/hooks/useCalculator";
import { formatINRFull } from "@/features/finance-calc/utils/formatter";
import { loanVsInvest } from "@/features/finance-calc/utils/math";
import { generateInsights } from "@/features/finance-calc/utils/insights";
import { SplitShell } from "@/features/finance-calc/components/layout/SplitShell";
import { InputRow } from "@/features/finance-calc/components/inputs/InputRow";
import { NeonSlider } from "@/features/finance-calc/components/inputs/NeonSlider";
import { ActionButtonRow } from "@/features/finance-calc/components/inputs/ActionButtonRow";
import { ResultHero } from "@/features/finance-calc/components/results/ResultHero";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricRow } from "@/features/finance-calc/components/results/MetricRow";
import { InsightBanner } from "@/features/finance-calc/components/results/InsightBanner";
import { WinnerBanner } from "@/features/finance-calc/components/results/WinnerBanner";
import { Card, CardContent } from "@/components/ui/card";

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

  const insights = r ? generateInsights("loanvsinvest", r, inputs) : [];

  const winner = r && r.netDifference >= 0 ? "invest" : "repay";
  const diffValue = r ? formatINRFull(Math.abs(r.netDifference)) : "—";

  return (
    <SplitShell
      left={
        <>
          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Investment Mode
          </p>
          <Tabs value={String(inputs.mode || "lump")} onValueChange={(v) => updateInput("mode", v)}>
            <TabsList className="w-full">
              <TabsTrigger value="lump" className="flex-1">LUMP SUM</TabsTrigger>
              <TabsTrigger value="sip" className="flex-1">SIP</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            {String(inputs.mode) === "sip" ? "Monthly Investment" : "Loan Amount"}
          </p>
          <InputRow
            fields={[{
              value: Number(inputs.amount),
              onChange: (v) => updateInput("amount", parseFloat(v.replace(/[,\s]/g, "")) || 0),
              label: String(inputs.mode) === "sip" ? "MONTHLY" : "AMOUNT", step: 50000,
            }]}
            className="mb-5"
          />

          <NeonSlider
            label="LOAN INTEREST RATE"
            value={Number(inputs.loanRate)}
            onChange={(v) => updateInput("loanRate", v)}
            min={1}
            max={20}
            step={0.1}
            unit="% P.A."
            tickLabels={["1%", "6%", "10%", "15%", "20%"]}
          />

          <NeonSlider
            label="EXPECTED INVESTMENT RETURN"
            value={Number(inputs.investRate)}
            onChange={(v) => updateInput("investRate", v)}
            min={1}
            max={30}
            step={0.5}
            unit="% P.A."
            tickLabels={["1%", "8%", "15%", "22%", "30%"]}
          />

          <NeonSlider
            label="TIME PERIOD"
            value={Number(inputs.years)}
            onChange={(v) => updateInput("years", v)}
            min={1}
            max={30}
            step={1}
            unit="YRS"
            tickLabels={["1 YR", "8 YR", "15 YR", "22 YR", "30 YR"]}
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
              {winner === "invest" ? (
                <ResultHero value={formatINRFull(r.finalInvestValue)} subtitle="Investment grows to" variant="positive" />
              ) : (
                <ResultHero value={formatINRFull(r.totalInterest)} subtitle="Total interest paid" variant="negative" />
              )}

              <WinnerBanner
                winner={winner}
                difference={diffValue}
                investValue={formatINRFull(r.finalInvestValue)}
                repayValue={formatINRFull(r.totalInterest)}
              />

              <Card className="bg-card border-border mt-4">
                <CardContent className="p-4 flex flex-col gap-1">
                  <MetricRow label="Final Investment Value" value={formatINRFull(r.finalInvestValue)} variant="positive" index={0} />
                  <MetricRow label="Total Loan Interest" value={formatINRFull(r.totalInterest)} variant="negative" index={1} />
                  <MetricRow label="Net Difference" value={formatINRFull(Math.abs(r.netDifference))} variant={r.netDifference >= 0 ? "positive" : "negative"} index={2} />
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
