export function safeValue(v: unknown, fallback = 0): number {
  const n = Number(v);
  return isNaN(n) || !isFinite(n) ? fallback : n;
}

export function sipFV(monthly: number, months: number, ratePct: number): number {
  if (ratePct === 0) return monthly * months;
  const r = ratePct / 12 / 100;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

export function sipYearlyBreakdown(monthly: number, years: number, ratePct: number): { year: number; invested: number; returns: number; corpus: number }[] {
  const rows: { year: number; invested: number; returns: number; corpus: number }[] = [];
  let cumulativeCorpus = 0;
  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const corpus = sipFV(monthly, months, ratePct);
    const invested = monthly * months;
    cumulativeCorpus = corpus;
    rows.push({ year: y, invested: Math.round(invested), returns: Math.round(corpus - invested), corpus: Math.round(corpus) });
  }
  return rows;
}

export function emi(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  const n = months;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

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

export function rdMaturity(monthly: number, ratePct: number, years: number): number {
  if (ratePct === 0) return monthly * years * 12;
  const r = ratePct / (4 * 100);
  const n = years * 4;
  const base = monthly * ((Math.pow(1 + r, n) - 1) / (1 - Math.pow(1 + r, -1 / 3)));
  return base;
}

export function cagr(initial: number, final: number, years: number): number {
  if (initial <= 0 || years <= 0) return 0;
  return (Math.pow(final / initial, 1 / years) - 1) * 100;
}

export function ruleOf72(ratePct: number): number {
  if (ratePct <= 0) return 0;
  return 72 / ratePct;
}

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

export function loanVsInvest(amount: number, loanRate: number, investRate: number, years: number): { totalInterest: number; finalInvestValue: number; netDifference: number; rows: { year: number; investValue: number; totalPaid: number }[] } {
  const monthlyLoanRate = loanRate / 12 / 100;
  const months = years * 12;
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
  const netDifference = fv - totalPaid;
  const rows: { year: number; investValue: number; totalPaid: number }[] = [];
  for (let y = 1; y <= years; y++) {
    rows.push({
      year: y,
      investValue: Math.round(amount * Math.pow(1 + r, y * 12)),
      totalPaid: Math.round((emiAmt * y * 12))
    });
  }
  return { totalInterest: Math.round(totalInterest), finalInvestValue: Math.round(fv), netDifference: Math.round(netDifference), rows };
}
