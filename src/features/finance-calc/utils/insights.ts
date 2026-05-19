import { CalculatorInputs, CalculatorResult } from "@/features/finance-calc/types/calculator";
import { ruleOf72 } from "./math";

export function generateInsights(calcId: string, result: CalculatorResult, inputs: CalculatorInputs): { icon: string; title: string; description: string }[] {
  switch (calcId) {
    case "sip": return sipInsights(result, inputs);
    case "emi": return emiInsights(result, inputs);
    case "fd": return fdInsights(result, inputs);
    case "cagr": return cagrInsights(result, inputs);
    case "retirement": return retirementInsights(result, inputs);
    case "tax": return taxInsights(result, inputs);
    case "loanvsinvest": return loanVsInvestInsights(result, inputs);
    default: return [];
  }
}

function sipInsights(result: CalculatorResult, inputs: CalculatorInputs) {
  const r: { icon: string; title: string; description: string }[] = [];
  const rate = inputs.rate as number;
  if (rate > 0) {
    const years = ruleOf72(rate);
    r.push({
      icon: "💡",
      title: "Your money doubles every " + Math.round(years) + " years",
      description: "At " + rate + "% return, ₹1 Lakh becomes ₹2 Lakhs in about " + Math.round(years) + " years."
    });
  }
  const maturity = result.maturity as number;
  if (maturity >= 10000000) {
    r.push({
      icon: "🏆",
      title: "You'll be a Crorepati!",
      description: "Your investment grows to " + (maturity / 10000000).toFixed(2) + " Crores — a crorepati milestone!"
    });
  }
  const invested = result.invested as number;
  const returns = result.returns as number;
  if (invested > 0) {
    const ratio = ((returns / invested) * 100);
    r.push({
      icon: "📈",
      title: "Returns are " + ratio.toFixed(0) + "% of your investment",
      description: "For every ₹1 you invest, the market adds ₹" + (returns / invested).toFixed(2) + " on top."
    });
  }
  return r;
}

function emiInsights(result: CalculatorResult, inputs: CalculatorInputs) {
  const r: { icon: string; title: string; description: string }[] = [];
  const totalInterest = result.totalInterest as number;
  const principal = inputs.amount as number;
  if (principal > 0) {
    const perLakh = (totalInterest / principal) * 100000;
    r.push({
      icon: "💡",
      title: "You pay ₹" + Math.round(perLakh) + " extra per ₹1 Lakh borrowed",
      description: "That's " + ((totalInterest / principal) * 100).toFixed(1) + "% of the loan amount as interest."
    });
  }
  const emiAmt = result.emi as number;
  const extraPerMonth = emiAmt * 0.1;
  const totalMonths = (inputs.years as number) * 12;
  const potentialSavings = extraPerMonth * totalMonths;
  r.push({
    icon: "💰",
    title: "Paying ₹" + Math.round(extraPerMonth) + " more/month saves ₹" + Math.round(potentialSavings),
    description: "A small increase in EMI can save you significant interest over the loan term."
  });
  const totalPayment = result.totalPayment as number;
  const startYear = new Date().getFullYear();
  const endYear = startYear + (inputs.years as number);
  r.push({
    icon: "📅",
    title: "Your loan ends in " + endYear,
    description: "You'll be debt-free by " + endYear + " — that's " + inputs.years + " years from now."
  });
  return r;
}

function fdInsights(result: CalculatorResult, inputs: CalculatorInputs) {
  const r: { icon: string; title: string; description: string }[] = [];
  const maturity = result.maturity as number;
  const principal = inputs.amount as number;
  if (principal > 0) {
    const growthPct = ((maturity - principal) / principal) * 100;
    r.push({
      icon: "📈",
      title: "Your money grows by " + growthPct.toFixed(1) + "% in " + inputs.years + " years",
      description: "₹1,000 invested today becomes ₹" + Math.round((maturity / principal) * 1000) + "."
    });
  }
  const rate = inputs.rate as number;
  const inflation = 6;
  const realReturn = rate - inflation;
  if (realReturn > 0) {
    r.push({
      icon: "✅",
      title: "Beats inflation by " + realReturn.toFixed(1) + "%",
      description: "After adjusting for 6% inflation, your real return is " + realReturn.toFixed(1) + "%."
    });
  } else {
    r.push({
      icon: "⚠️",
      title: "Below inflation rate",
      description: "At " + rate + "%, your money loses purchasing power to inflation (6%). Consider higher returns."
    });
  }
  return r;
}

function cagrInsights(result: CalculatorResult, inputs: CalculatorInputs) {
  const r: { icon: string; title: string; description: string }[] = [];
  const cagrVal = result.cagr as number;
  if (cagrVal > 0) {
    const doubleYears = ruleOf72(cagrVal);
    r.push({
      icon: "💡",
      title: "Your money doubles every " + Math.round(doubleYears) + " years",
      description: "At " + cagrVal.toFixed(2) + "% CAGR, ₹1 Lakh becomes ₹2 Lakhs in ~" + Math.round(doubleYears) + " years."
    });
    const initial = inputs.initial as number;
    const final = inputs.final as number;
    r.push({
      icon: "💰",
      title: "₹1 Lakh grew to ₹" + (final / initial * 100000 / 100000).toFixed(2) + " Lakhs",
      description: "Your investment grew " + (final / initial).toFixed(2) + "x over " + inputs.years + " years."
    });
    const fdRate = 7;
    if (cagrVal > fdRate) {
      r.push({
        icon: "🏆",
        title: "Beats FD by " + (cagrVal - fdRate).toFixed(2) + "%",
        description: "Your returns are " + ((cagrVal - fdRate) / fdRate * 100).toFixed(0) + "% higher than a typical FD."
      });
    }
  }
  return r;
}

function retirementInsights(result: CalculatorResult, inputs: CalculatorInputs) {
  const r: { icon: string; title: string; description: string }[] = [];
  const monthlySip = result.monthlySip as number;
  const dailySaving = Math.round(monthlySip / 30);
  r.push({
    icon: "💡",
    title: "You need to save ₹" + dailySaving + "/day to retire comfortably",
    description: "That's ₹" + monthlySip.toLocaleString("en-IN") + "/month — about " + (dailySaving > 100 ? "a couple of coffees" : "one coffee") + " a day."
  });
  const lifeExpectancy = inputs.lifeExpectancy as number;
  r.push({
    icon: "📅",
    title: "Your retirement fund lasts until age " + lifeExpectancy,
    description: "We planned your corpus to last from age " + inputs.retirementAge + " to " + lifeExpectancy + "."
  });
  const currentAge = inputs.currentAge as number;
  if (currentAge >= 5) {
    const earlierAge = currentAge - 5;
    r.push({
      icon: "⏰",
      title: "Start 5 years earlier, save ₹" + Math.round(monthlySip * 0.35).toLocaleString("en-IN") + "/month less",
      description: "Starting at " + earlierAge + " instead of " + currentAge + " reduces your monthly SIP by ~35%."
    });
  }
  return r;
}

function taxInsights(result: CalculatorResult, inputs: CalculatorInputs) {
  const r: { icon: string; title: string; description: string }[] = [];
  const totalTax = result.totalTax as number;
  const income = inputs.income as number;
  if (income > 0) {
    const effectiveRate = (totalTax / income) * 100;
    r.push({
      icon: "💡",
      title: "Your effective tax rate is " + effectiveRate.toFixed(2) + "% of income",
      description: "You pay ₹" + totalTax.toLocaleString("en-IN") + " in tax on ₹" + income.toLocaleString("en-IN") + " income."
    });
  }
  const takeHome = income - totalTax;
  r.push({
    icon: "💰",
    title: "You keep ₹" + takeHome.toLocaleString("en-IN") + " after taxes",
    description: "Out of ₹" + income.toLocaleString("en-IN") + ", you take home ₹" + takeHome.toLocaleString("en-IN") + "."
  });
  return r;
}

function loanVsInvestInsights(result: CalculatorResult, inputs: CalculatorInputs) {
  const r: { icon: string; title: string; description: string }[] = [];
  const diff = result.netDifference as number;
  if (diff >= 0) {
    r.push({
      icon: "🏆",
      title: "Investing wins by ₹" + diff.toLocaleString("en-IN"),
      description: "Investing gives you ₹" + diff.toLocaleString("en-IN") + " more than repaying the loan early."
    });
  } else {
    r.push({
      icon: "✅",
      title: "Repaying wins by ₹" + Math.abs(diff).toLocaleString("en-IN"),
      description: "Paying off the loan saves you ₹" + Math.abs(diff).toLocaleString("en-IN") + " more than investing."
    });
  }
  const totalInterest = result.totalInterest as number;
  r.push({
    icon: "💰",
    title: "Loan costs ₹" + totalInterest.toLocaleString("en-IN") + " in interest",
    description: "Over " + inputs.years + " years, you pay ₹" + totalInterest.toLocaleString("en-IN") + " in total interest."
  });
  return r;
}
