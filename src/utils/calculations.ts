/**
 * Calculates the future value of a SIP (Systematic Investment Plan).
 * @param monthly - Monthly investment amount
 * @param months - Number of months
 * @param ratePct - Expected annual return rate in percentage
 * @returns Future value of the SIP
 */
export function sipFV(monthly: number, months: number, ratePct: number): number {
  if (ratePct === 0) return monthly * months;
  const r = ratePct / 12 / 100;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

/**
 * Calculates the EMI for a loan.
 * @param principal - Loan principal amount
 * @param annualRate - Annual interest rate in percentage
 * @param months - Loan tenure in months
 * @returns Monthly EMI amount
 */
export function emi(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/**
 * Generates a yearly breakdown of EMI payments.
 * @param principal - Loan principal amount
 * @param annualRate - Annual interest rate in percentage
 * @param months - Loan tenure in months
 * @returns Array of yearly breakdown rows
 */
export function emiBreakdown(principal: number, annualRate: number, months: number): { year: number; emi: number; principalPaid: number; interestPaid: number; balance: number }[] {
  const rows: { year: number; emi: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
  const monthlyRate = annualRate / 12 / 100;
  const emiAmt = emi(principal, annualRate, months);
  let balance = principal;
  for (let y = 1; y <= Math.ceil(months / 12); y++) {
    let yrPrincipal = 0;
    let yrInterest = 0;
    const count = Math.min(12, months - (y - 1) * 12);
    for (let m = 0; m < count; m++) {
      const interest = balance * monthlyRate;
      const principalPart = emiAmt - interest;
      yrPrincipal += principalPart;
      yrInterest += interest;
      balance -= principalPart;
    }
    rows.push({
      year: y,
      emi: Math.round(emiAmt * count),
      principalPaid: Math.round(yrPrincipal),
      interestPaid: Math.round(yrInterest),
      balance: Math.round(Math.max(0, balance))
    });
  }
  return rows;
}

/**
 * Calculates the maturity amount for a Fixed Deposit.
 * @param principal - Principal amount
 * @param ratePct - Annual interest rate in percentage
 * @param years - Number of years
 * @param compounding - Compounding frequency (monthly, quarterly, half-yearly, yearly, simple)
 * @returns Maturity amount
 */
export function fdMaturity(principal: number, ratePct: number, years: number, compounding: string): number {
  if (ratePct === 0) return principal;
  const r = ratePct / 100;
  let n: number;
  switch (compounding) {
    case "monthly": n = 12; break;
    case "quarterly": n = 4; break;
    case "half-yearly": n = 2; break;
    case "yearly": n = 1; break;
    case "simple": return principal * (1 + r * years);
    default: n = 4;
  }
  return principal * Math.pow(1 + r / n, n * years);
}

/**
 * Calculates the maturity amount for a Recurring Deposit.
 * @param monthly - Monthly deposit amount
 * @param ratePct - Annual interest rate in percentage
 * @param years - Number of years
 * @returns Maturity amount
 */
export function rdMaturity(monthly: number, ratePct: number, years: number): number {
  if (ratePct === 0) return monthly * years * 12;
  const r = ratePct / (4 * 100);
  const n = years * 4;
  return monthly * ((Math.pow(1 + r, n) - 1) / (1 - Math.pow(1 + r, -1 / 3)));
}

/**
 * Calculates the Compound Annual Growth Rate (CAGR).
 * @param initial - Initial investment value
 * @param final - Final value
 * @param years - Number of years
 * @returns CAGR as a percentage
 */
export function cagr(initial: number, final: number, years: number): number {
  if (initial <= 0 || years <= 0) return 0;
  return (Math.pow(final / initial, 1 / years) - 1) * 100;
}

/**
 * Estimates the number of years to double an investment using the Rule of 72.
 * @param ratePct - Annual rate of return in percentage
 * @returns Number of years to double
 */
export function ruleOf72(ratePct: number): number {
  if (ratePct <= 0) return 0;
  return 72 / ratePct;
}

/**
 * Calculates retirement corpus, future monthly expenses, and required monthly SIP.
 * @param monthlyExpense - Current monthly expenses
 * @param inflationPct - Expected inflation rate in percentage
 * @param currentAge - Current age in years
 * @param retirementAge - Planned retirement age
 * @param lifeExpectancy - Life expectancy
 * @param investReturnPct - Expected investment return in percentage
 * @returns Object with fme, corpus, monthlySip, yearsToRetire
 */
export function retirementCorpus(monthlyExpense: number, inflationPct: number, currentAge: number, retirementAge: number, lifeExpectancy: number, investReturnPct: number): { fme: number; corpus: number; monthlySip: number; yearsToRetire: number } {
  const yearsToRetire = retirementAge - currentAge;
  const retirementYears = lifeExpectancy - retirementAge;
  const inflationRate = inflationPct / 100;
  const investRate = investReturnPct / 100;
  const fme = monthlyExpense * Math.pow(1 + inflationRate, yearsToRetire);
  const realRate = (1 + investRate) / (1 + inflationRate) - 1;
  let corpus = 0;
  if (realRate === 0) {
    corpus = fme * 12 * retirementYears;
  } else {
    corpus = fme * 12 * ((1 - Math.pow(1 + realRate, -retirementYears)) / realRate);
  }
  let monthlySip = 0;
  if (yearsToRetire > 0 && investRate > 0) {
    const r = investRate / 12;
    const n = yearsToRetire * 12;
    monthlySip = corpus / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  } else if (yearsToRetire > 0) {
    monthlySip = corpus / (yearsToRetire * 12);
  }
  return { fme: Math.round(fme), corpus: Math.round(corpus), monthlySip: Math.round(monthlySip), yearsToRetire };
}

/**
 * Calculates income tax under the new tax regime (India).
 * @param income - Annual income
 * @returns Object with taxable income, baseTax, cess, totalTax, effectiveRate
 */
export function taxNewRegime(income: number): { taxable: number; baseTax: number; cess: number; totalTax: number; effectiveRate: number } {
  const standardDeduction = 75000;
  const taxable = Math.max(0, income - standardDeduction);
  let baseTax = 0;
  const slabs = [
    { min: 0, max: 400000, rate: 0 },
    { min: 400000, max: 800000, rate: 5 },
    { min: 800000, max: 1200000, rate: 10 },
    { min: 1200000, max: 1600000, rate: 15 },
    { min: 1600000, max: 2000000, rate: 20 },
    { min: 2000000, max: 2400000, rate: 25 },
    { min: 2400000, max: Infinity, rate: 30 }
  ];
  for (const slab of slabs) {
    if (taxable > slab.min) {
      const amt = Math.min(taxable, slab.max) - slab.min;
      baseTax += amt * slab.rate / 100;
    }
  }
  let rebate = 0;
  if (taxable <= 700000) rebate = baseTax;
  baseTax = Math.max(0, baseTax - rebate);
  const cess = Math.round(baseTax * 0.04);
  const totalTax = Math.round(baseTax + cess);
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  return { taxable: Math.round(taxable), baseTax: Math.round(baseTax), cess, totalTax, effectiveRate };
}

/**
 * Calculates income tax under the old tax regime (India).
 * @param income - Annual income
 * @param deduction80C - Section 80C deductions
 * @returns Object with taxable income, baseTax, cess, totalTax, effectiveRate
 */
export function taxOldRegime(income: number, deduction80C: number): { taxable: number; baseTax: number; cess: number; totalTax: number; effectiveRate: number } {
  const standardDeduction = 50000;
  const ded80C = Math.min(deduction80C, 150000);
  let taxable = Math.max(0, income - standardDeduction - ded80C);
  let baseTax = 0;
  const slabs = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 5 },
    { min: 500000, max: 1000000, rate: 20 },
    { min: 1000000, max: Infinity, rate: 30 }
  ];
  for (const slab of slabs) {
    if (taxable > slab.min) {
      const amt = Math.min(taxable, slab.max) - slab.min;
      baseTax += amt * slab.rate / 100;
    }
  }
  let rebate = 0;
  if (taxable <= 500000) rebate = baseTax;
  baseTax = Math.max(0, baseTax - rebate);
  const cess = Math.round(baseTax * 0.04);
  const totalTax = Math.round(baseTax + cess);
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  return { taxable: Math.round(taxable), baseTax: Math.round(baseTax), cess, totalTax, effectiveRate };
}

/**
 * Compares loan repayment vs investing for a lump sum or SIP amount.
 * @param amount - Principal amount (lump sum) or monthly SIP amount
 * @param loanRate - Loan interest rate in percentage
 * @param investRate - Expected investment return in percentage
 * @param years - Time period in years
 * @param mode - "lump" for lump sum, "sip" for SIP
 * @returns Comparison result with totalInterest, finalInvestValue, netDifference, rows
 */
export function loanVsInvest(amount: number, loanRate: number, investRate: number, years: number, mode: string = "lump"): { totalInterest: number; finalInvestValue: number; netDifference: number; rows: { year: number; investValue: number; totalPaid: number }[] } {
  const months = years * 12;

  if (mode === "sip") {
    const totalInvested = amount * months;
    const fvInvest = sipFV(amount, months, investRate);
    const fvRepay = sipFV(amount, months, loanRate);
    const rows: { year: number; investValue: number; totalPaid: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      rows.push({
        year: y,
        investValue: Math.round(sipFV(amount, m, investRate)),
        totalPaid: Math.round(sipFV(amount, m, loanRate)),
      });
    }
    return {
      totalInterest: Math.round(Math.max(0, fvRepay - totalInvested)),
      finalInvestValue: Math.round(fvInvest),
      netDifference: Math.round(fvInvest - fvRepay),
      rows,
    };
  }

  const monthlyLoanRate = loanRate / 12 / 100;
  let emiAmt: number;
  if (loanRate === 0) {
    emiAmt = amount / months;
  } else {
    emiAmt = (amount * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, months)) / (Math.pow(1 + monthlyLoanRate, months) - 1);
  }
  const totalPaid = emiAmt * months;
  const totalInterest = totalPaid - amount;
  const r = investRate / 12 / 100;
  let fv: number;
  if (r === 0) {
    fv = amount;
  } else {
    fv = amount * Math.pow(1 + r, months);
  }
  const fvSavedEMIs = r === 0 ? emiAmt * months : emiAmt * ((Math.pow(1 + r, months) - 1) / r);
  const netDifference = fv - fvSavedEMIs;
  const rows: { year: number; investValue: number; totalPaid: number }[] = [];
  for (let y = 1; y <= years; y++) {
    rows.push({
      year: y,
      investValue: Math.round(amount * Math.pow(1 + r, y * 12)),
      totalPaid: Math.round(r === 0 ? emiAmt * y * 12 : emiAmt * ((Math.pow(1 + r, y * 12) - 1) / r))
    });
  }
  return { totalInterest: Math.round(totalInterest), finalInvestValue: Math.round(fv), netDifference: Math.round(netDifference), rows };
}

/** Returns the status string based on spending percentage. */
function getStatus(percent: number): "safe" | "warning" | "over" {
  if (percent >= 100) return "over";
  if (percent >= 75) return "warning";
  return "safe";
}

/** Filters transactions to those within a date range. */
function filterByDateRange(txns: Transaction[], range: DateRange): Transaction[] {
  return txns.filter((t) => t.date >= range.startDate && t.date <= range.endDate);
}

import type { BudgetCategory, Transaction, BudgetSummary, CategoryBreakdown, DateRange } from "@/types";

/**
 * Computes a date range for a given month and year.
 * @param month - Month (0-indexed)
 * @param year - Full year
 * @returns DateRange with start and end dates
 */
export function getMonthDateRange(month: number, year: number): DateRange {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { startDate, endDate };
}

/**
 * Computes a full budget summary from categories, transactions, and an optional date range.
 * @param categories - Array of budget categories
 * @param transactions - Array of transactions
 * @param dateRange - Optional date range; defaults to current month
 * @returns BudgetSummary object
 */
export function computeBudgetSummary(
  categories: BudgetCategory[],
  transactions: Transaction[],
  dateRange?: DateRange
): BudgetSummary {
  const range = dateRange ?? getMonthDateRange(new Date().getMonth(), new Date().getFullYear());
  const filtered = dateRange ? filterByDateRange(transactions, range) : transactions;

  const totalLimit = categories.reduce((s, c) => s + c.monthlyLimit, 0);
  const totalSpent = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const percentSpent = totalLimit > 0 ? Math.min(100, (totalSpent / totalLimit) * 100) : 0;
  const daysLeft = computeDaysLeftInRange(range);

  const categoryBreakdown: CategoryBreakdown[] = categories.map((cat) => {
    const spent = filtered.filter((t) => t.categoryId === cat.id && t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const remaining = Math.max(0, cat.monthlyLimit - spent);
    const pct = cat.monthlyLimit > 0 ? Math.min(100, (spent / cat.monthlyLimit) * 100) : 0;
    return { category: cat, spent, remaining, percentSpent: pct, status: getStatus(pct) };
  });

  return { totalLimit, totalSpent, totalRemaining, percentSpent, daysLeft, dateRange: range, categoryBreakdown };
}

/**
 * Computes the number of days left in a date range from today.
 * @param range - The date range
 * @returns Number of days left (minimum 0)
 */
export function computeDaysLeftInRange(range: DateRange): number {
  const now = new Date();
  const end = new Date(range.endDate + "T23:59:59");
  const diff = Math.ceil((end.getTime() - now.getTime()) / 86400000);
  return Math.max(0, diff);
}

/**
 * Returns today's date as an ISO date string (YYYY-MM-DD).
 */
export function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Generates a unique ID using timestamp and random characters.
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Formats a DateRange into a human-readable string.
 * @param range - The date range
 * @returns Formatted string like "Jan 1 - Jan 31, 2024"
 */
export function formatDateRange(range: DateRange): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  const s = new Date(range.startDate + "T00:00:00");
  const e = new Date(range.endDate + "T00:00:00");
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${e.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("en-IN", opts)} - ${e.toLocaleDateString("en-IN", opts)}`;
}
