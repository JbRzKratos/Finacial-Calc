export function sipFV(monthly, months, annualRate) {
  const r = annualRate / 100 / 12;
  if (r === 0) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

export function sipYearlyBreakdown(monthly, years, annualRate) {
  const rows = [];
  const monthsTotal = years * 12;
  const r = annualRate / 100 / 12;
  let corpus = 0;

  for (let y = 1; y <= years; y++) {
    const monthsThisYear = Math.min(y * 12, monthsTotal);
    const invested = monthly * monthsThisYear;
    for (let m = (y - 1) * 12 + 1; m <= monthsThisYear; m++) {
      corpus = (corpus + monthly) * (1 + r);
    }
    const returns = corpus - invested;
    rows.push({ year: y, invested: Math.round(invested), returns: Math.round(returns), corpus: Math.round(corpus) });
  }
  return rows;
}

export function emiPMT(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

export function emiAmortization(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  const emi = emiPMT(principal, annualRate, months);
  const rows = [];
  let balance = principal;
  let yearPrincipal = 0;
  let yearInterest = 0;
  let currentYear = 1;

  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const principalPart = emi - interest;
    balance -= principalPart;
    yearPrincipal += principalPart;
    yearInterest += interest;

    if (m % 12 === 0 || m === months) {
      rows.push({
        year: currentYear,
        opening: currentYear === 1 ? principal : rows[currentYear - 2].balance,
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        total: Math.round(yearPrincipal + yearInterest),
        balance: Math.round(Math.max(0, balance))
      });
      yearPrincipal = 0;
      yearInterest = 0;
      currentYear++;
    }
  }
  return rows;
}

export function fdFV(principal, annualRate, years, compounding, isSimple = false) {
  if (isSimple) {
    return principal * (1 + annualRate * years / 100);
  }
  const periods = { M: 12, Q: 4, H: 2, Y: 1 };
  const n = (periods[compounding] || 12);
  const r = annualRate / 100 / n;
  const nt = n * years;
  return principal * Math.pow(1 + r, nt);
}

export function rdFV(monthly, years, annualRate) {
  const quarters = years * 4;
  const r = annualRate / 400;
  if (r === 0) return monthly * years * 12;
  return monthly * (Math.pow(1 + r, quarters) - 1) / (1 - Math.pow(1 + r, -1/3));
}

export function rdGrowthCurve(monthly, years, annualRate) {
  const rows = [];
  let totalDeposited = 0;
  for (let y = 1; y <= years; y++) {
    const m = y * 12;
    totalDeposited += monthly * 12;
    const val = rdFV(monthly, y, annualRate);
    rows.push({ year: y, value: Math.round(val), invested: Math.round(totalDeposited) });
  }
  return rows;
}

export function fdGrowthCurve(principal, annualRate, years, compounding, isSimple = false) {
  if (isSimple) {
    const rows = [];
    for (let y = 1; y <= years; y++) {
      const val = principal * (1 + annualRate * y / 100);
      rows.push({ year: y, value: Math.round(val) });
    }
    return rows;
  }
  const periods = { M: 12, Q: 4, H: 2, Y: 1 };
  const n = (periods[compounding] || 12);
  const r = annualRate / 100 / n;
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const nt = n * y;
    const val = principal * Math.pow(1 + r, nt);
    rows.push({ year: y, value: Math.round(val) });
  }
  return rows;
}

export function cagr(initial, final, years) {
  if (initial <= 0 || years <= 0) return 0;
  return Math.pow(final / initial, 1 / years) - 1;
}

export function retirementCorpus(currentAge, retireAge, lifeExpectancy, monthlyExpenses, inflationRate, returnRate) {
  const yearsToRetire = retireAge - currentAge;
  const retireYears = lifeExpectancy - retireAge;
  if (yearsToRetire <= 0 || retireYears <= 0) return { corpus: 0, monthlySIP: 0 };

  const rInflation = inflationRate / 100;
  const rReturn = returnRate / 100;
  const rReal = (1 + rReturn) / (1 + rInflation) - 1;

  let totalCorpus = 0;
  const monthlyExpenseAtRetire = monthlyExpenses * Math.pow(1 + rInflation, yearsToRetire);
  const totalMonths = retireYears * 12;
  const monthlyRate = rReal / 12;

  if (monthlyRate === 0) {
    totalCorpus = monthlyExpenseAtRetire * totalMonths;
  } else {
    totalCorpus = monthlyExpenseAtRetire * (1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate;
  }

  const sipMonthlyRate = rReturn / 12;
  let monthlySIP = 0;
  const sipMonths = yearsToRetire * 12;
  if (sipMonthlyRate > 0 && sipMonths > 0) {
    monthlySIP = totalCorpus * sipMonthlyRate / ((Math.pow(1 + sipMonthlyRate, sipMonths) - 1) * (1 + sipMonthlyRate));
  } else if (sipMonths > 0) {
    monthlySIP = totalCorpus / sipMonths;
  }

  return {
    corpus: Math.round(totalCorpus),
    monthlySIP: Math.round(monthlySIP),
    monthlyExpenseAtRetire: Math.round(monthlyExpenseAtRetire)
  };
}

export function retirementGrowthCurve(currentAge, retireAge, lifeExpectancy, monthlyExpenses, inflationRate, returnRate) {
  const yearsToRetire = retireAge - currentAge;
  const retireYears = lifeExpectancy - retireAge;
  const rReturn = returnRate / 100;
  const rInflation = inflationRate / 100;
  const rows = [];
  let corpus = 0;
  const targetMonthlyExpense = monthlyExpenses * Math.pow(1 + rInflation, yearsToRetire);
  const monthlyRate = rReturn / 12;

  const { monthlySIP } = retirementCorpus(currentAge, retireAge, lifeExpectancy, monthlyExpenses, inflationRate, returnRate);

  for (let y = 1; y <= yearsToRetire + retireYears; y++) {
    if (y <= yearsToRetire) {
      for (let m = 0; m < 12; m++) {
        corpus = (corpus + monthlySIP) * (1 + monthlyRate);
      }
      rows.push({ year: currentAge + y, type: 'accumulation', value: Math.round(corpus) });
    } else {
      const yearlyExpense = targetMonthlyExpense * 12 * Math.pow(1 + rInflation, y - yearsToRetire);
      corpus -= yearlyExpense;
      if (corpus < 0) corpus = 0;
      rows.push({ year: currentAge + y, type: 'withdrawal', value: Math.round(corpus) });
    }
  }
  return rows;
}

export function taxSaved(income, investment80C, taxRegime = 'new', otherDeductions = 0) {
  const slabsNew = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 5 },
    { limit: 1000000, rate: 10 },
    { limit: 1200000, rate: 15 },
    { limit: 1500000, rate: 20 },
    { limit: Infinity, rate: 30 }
  ];
  const slabsOld = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 5 },
    { limit: 1000000, rate: 20 },
    { limit: Infinity, rate: 30 }
  ];

  const slabs = taxRegime === 'new' ? slabsNew : slabsOld;
  const max80C = Math.min(investment80C, 150000);
  const standardDeduction = taxRegime === 'new' ? 75000 : 50000;
  const oldDeductions = taxRegime === 'old' ? max80C + Math.min(otherDeductions, 500000) : 0;

  const taxableIncomeWithDed = Math.max(0, income - standardDeduction - oldDeductions);
  const taxableIncomeWithoutDed = Math.max(0, income - standardDeduction);

  function taxFor(inc) {
    let tax = 0;
    let prev = 0;
    for (const s of slabs) {
      if (inc > prev) {
        const taxable = Math.min(inc, s.limit) - prev;
        tax += taxable * s.rate / 100;
      }
      if (inc <= s.limit) break;
      prev = s.limit;
    }
    const rebateLimit = taxRegime === 'new' ? 700000 : 500000;
    if (inc <= rebateLimit) {
      const rebate = Math.min(tax, 25000);
      tax = Math.max(0, tax - rebate);
    }
    if (tax > 0) {
      tax += tax * 0.04;
    }
    return Math.round(tax);
  }

  const taxWithout = taxFor(taxableIncomeWithoutDed);
  const taxWith = taxFor(taxableIncomeWithDed);
  const saved = Math.max(0, taxWithout - taxWith);

  return {
    taxWithout,
    taxWith,
    saved,
    taxableIncome: taxableIncomeWithDed
  };
}

export function loanVsInvest(amount, loanRate, investRate, years, mode = 'sip') {
  if (mode === 'lumpsum') {
    const investFV = amount * Math.pow(1 + investRate / 100, years);
    const rLoan = loanRate / 100 / 12;
    const months = years * 12;
    const emi = rLoan > 0
      ? amount * rLoan * Math.pow(1 + rLoan, months) / (Math.pow(1 + rLoan, months) - 1)
      : amount / months;
    const totalPaid = emi * months;
    const totalInterest = totalPaid - amount;
    const rows = [];
    for (let y = 1; y <= years; y++) {
      rows.push({
        year: y,
        loanBalance: 0,
        investValue: Math.round(amount * Math.pow(1 + investRate / 100, y)),
        totalPaid: Math.round(totalPaid * y / years)
      });
    }
    return {
      rows,
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalPaid),
      finalInvestValue: Math.round(investFV)
    };
  }

  const rLoan = loanRate / 100 / 12;
  const rInvest = investRate / 100 / 12;
  const months = years * 12;

  const emi = rLoan > 0
    ? amount * rLoan * Math.pow(1 + rLoan, months) / (Math.pow(1 + rLoan, months) - 1)
    : amount / months;

  const rows = [];
  let loanBalance = amount;
  let investValue = 0;
  let totalPaid = 0;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      if (loanBalance > 0) {
        const interest = loanBalance * rLoan;
        const principalPaid = emi - interest;
        loanBalance -= principalPaid;
        if (loanBalance < 0) loanBalance = 0;
        totalPaid += emi;
      }
      investValue = (investValue + emi) * (1 + rInvest);
    }
    rows.push({
      year: y,
      loanBalance: Math.round(Math.max(0, loanBalance)),
      investValue: Math.round(investValue),
      totalPaid: Math.round(totalPaid)
    });
  }

  const totalInterest = Math.round(totalPaid - amount);
  return { rows, totalInterest, totalPaid: Math.round(totalPaid), finalInvestValue: Math.round(investValue) };
}

export function ruleOf72(rate) {
  if (rate <= 0) return 0;
  return 72 / rate;
}

export function wealthRatio(principal, maturity) {
  if (principal <= 0) return 0;
  return maturity / principal;
}

export function safeValue(v) {
  return (typeof v === 'number' && Number.isFinite(v)) ? v : 0;
}
