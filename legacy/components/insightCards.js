import { formatINR, formatPercent, formatINRFull } from '../utils/formatter.js';
import { ruleOf72, wealthRatio } from '../utils/math.js';

const INSIGHT_ICONS = {
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
};

export function generateInsights(calcId, result, inputs) {
  const insights = [];

  switch (calcId) {
    case 'sip': {
      const totalInvested = result.invested;
      const totalReturns = result.returns;
      const maturity = result.maturity;
      const rate = inputs.rate || 0;

      if (rate > 0) {
        const doublingYears = ruleOf72(rate);
        insights.push({
          icon: 'trend',
          bgClass: 'positive-bg',
          text: `At ${formatPercent(rate)}, your money doubles approximately every <strong>${doublingYears.toFixed(1)} years</strong> (Rule of 72).`
        });
      }

      const returnsPct = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
      insights.push({
        icon: 'bulb',
        bgClass: 'accent-bg',
        text: `Returns contribute <strong>${returnsPct.toFixed(1)}%</strong> of your total corpus of ${formatINRFull(maturity)}.`
      });

      const totalMonths = (inputs.years || 1) * 12;
      const avgMonthlyReturn = totalMonths > 0 ? totalReturns / totalMonths : 0;
      insights.push({
        icon: 'target',
        bgClass: 'positive-bg',
        text: `You earn approximately <strong>${formatINRFull(avgMonthlyReturn)}/month</strong> in returns on average.`
      });
      break;
    }

    case 'emi': {
      const totalInterest = result.totalInterest;
      const totalPayment = result.totalPayment;
      const loanAmount = inputs.amount || 0;
      const rate = inputs.rate || 0;

      const interestPct = loanAmount > 0 ? (totalInterest / loanAmount) * 100 : 0;
      insights.push({
        icon: 'bulb',
        bgClass: 'negative-bg',
        text: `You pay <strong>${formatPercent(interestPct)}</strong> of your loan amount as interest (${formatINRFull(totalInterest)}).`
      });

      if (rate > 0 && loanAmount > 0) {
        const perLakh = loanAmount > 0 ? (totalInterest / loanAmount) * 100000 : 0;
        insights.push({
          icon: 'trend',
          bgClass: 'accent-bg',
          text: `For every ₹1L borrowed, you pay <strong>${formatINRFull(Math.round(perLakh))}</strong> in interest.`
        });
      }

      const emi = result.emi || 0;
      insights.push({
        icon: 'target',
        bgClass: 'positive-bg',
        text: `Your monthly EMI of <strong>${formatINRFull(emi)}</strong> includes both principal repayment and interest.`
      });
      break;
    }

    case 'fd': {
      const principal = inputs.principal || 0;
      const maturity = result.maturity;
      const interestEarned = maturity - principal;
      const rate = inputs.rate || 0;

      const wRatio = wealthRatio(principal, maturity);
      insights.push({
        icon: 'trend',
        bgClass: 'positive-bg',
        text: `Your principal grows <strong>${wRatio.toFixed(2)}x</strong> over the tenure.`
      });

      if (rate > 0) {
        const doublingYears = ruleOf72(rate);
        insights.push({
          icon: 'bulb',
          bgClass: 'accent-bg',
          text: `At ${formatPercent(rate)}, your money doubles in <strong>${doublingYears.toFixed(1)} years</strong>.`
        });
      }

      const interestPct = principal > 0 ? (interestEarned / principal) * 100 : 0;
      insights.push({
        icon: 'target',
        bgClass: 'positive-bg',
        text: `You earn <strong>${formatPercent(interestPct)}</strong> returns on your principal (${formatINRFull(interestEarned)}).`
      });
      break;
    }

    case 'cagr': {
      const cagrVal = result.cagr;
      const absReturn = result.absReturn;
      const initial = inputs.initial || 0;
      const final = inputs.final || 0;

      if (cagrVal > 0) {
        const doublingYears = ruleOf72(cagrVal * 100);
        insights.push({
          icon: 'trend',
          bgClass: 'positive-bg',
          text: `At this CAGR of <strong>${formatPercent(cagrVal * 100)}</strong>, your investment doubles in ~<strong>${doublingYears.toFixed(1)} years</strong>.`
        });
      }

      insights.push({
        icon: 'bulb',
        bgClass: 'accent-bg',
        text: `Your investment grew from ${formatINRFull(initial)} to ${formatINRFull(final)} — an absolute return of <strong>${formatPercent(absReturn)}</strong>.`
      });

      const years = inputs.years || 1;
      const annualizedGain = years > 0 ? (final - initial) / years : 0;
      insights.push({
        icon: 'target',
        bgClass: 'positive-bg',
        text: `You gained approximately <strong>${formatINRFull(Math.round(annualizedGain))}/year</strong> on average.`
      });
      break;
    }

    case 'retirement': {
      const corpus = result.corpus;
      const monthlySIP = result.monthlySIP;
      const monthlyExpenseAtRetire = result.monthlyExpenseAtRetire;

      insights.push({
        icon: 'target',
        bgClass: 'accent-bg',
        text: `You need a corpus of <strong>${formatINRFull(corpus)}</strong> to sustain your lifestyle in retirement.`
      });

      insights.push({
        icon: 'bulb',
        bgClass: 'positive-bg',
        text: `Start investing <strong>${formatINRFull(monthlySIP)}/month</strong> now to reach your retirement goal.`
      });

      const currentExpense = inputs.monthlyExpenses || 0;
      if (currentExpense > 0) {
        const increasePct = ((monthlyExpenseAtRetire - currentExpense) / currentExpense) * 100;
        insights.push({
          icon: 'trend',
          bgClass: 'negative-bg',
          text: `Due to inflation, your monthly expenses will rise <strong>${formatPercent(increasePct)}</strong> by retirement to ${formatINRFull(monthlyExpenseAtRetire)}.`
        });
      }
      break;
    }

    case 'taxSaver': {
      const saved = result.saved;
      const taxWithout = result.taxWithout;
      const taxWith = result.taxWith;

      if (saved > 0) {
        const pctSaved = taxWithout > 0 ? (saved / taxWithout) * 100 : 0;
        insights.push({
          icon: 'bulb',
          bgClass: 'positive-bg',
          text: `You save <strong>${formatPercent(pctSaved)}</strong> on your tax liability — that's <strong>${formatINRFull(saved)}</strong> in your pocket.`
        });
      }

      insights.push({
        icon: 'trend',
        bgClass: 'accent-bg',
        text: `Your effective tax rate drops from <strong>${formatPercent(taxWithout / inputs.income * 100)}</strong> to <strong>${formatPercent(taxWith / inputs.income * 100)}</strong>.`
      });

      const max80C = Math.min(inputs.investment80C || 0, 150000);
      const utilizationPct = 150000 > 0 ? (max80C / 150000) * 100 : 0;
      insights.push({
        icon: 'target',
        bgClass: utilizationPct >= 100 ? 'positive-bg' : 'negative-bg',
        text: `You've utilized <strong>${formatPercent(utilizationPct)}</strong> of the ₹1.5L 80C limit.`
      });
      break;
    }

    case 'loanVsInvest': {
      const finalInvestValue = result.finalInvestValue || 0;
      const totalInterest = result.totalInterest || 0;
      const amount = inputs.amount || 0;

      const diff = finalInvestValue - totalInterest;
      insights.push({
        icon: 'trend',
        bgClass: diff > 0 ? 'positive-bg' : 'negative-bg',
        text: diff > 0
          ? `Investing leaves you <strong>${formatINRFull(diff)} better off</strong> than paying off the loan.`
          : `Paying off the loan saves you <strong>${formatINRFull(Math.abs(diff))} more</strong> than investing.`
      });

      if (amount > 0) {
        const investPct = (finalInvestValue / amount) * 100;
        const interestPct = (totalInterest / amount) * 100;
        insights.push({
          icon: 'bulb',
          bgClass: 'accent-bg',
          text: `Investing grows to <strong>${formatPercent(investPct)}</strong> of principal vs paying <strong>${formatPercent(interestPct)}</strong> in interest.`
        });
      }

      const loanRate = inputs.loanRate || 0;
      const investRate = inputs.investRate || 0;
      insights.push({
        icon: 'target',
        bgClass: investRate > loanRate ? 'positive-bg' : 'negative-bg',
        text: investRate > loanRate
          ? `Your investment return (${formatPercent(investRate)}) beats the loan cost (${formatPercent(loanRate)}) — invest!`
          : `Your loan cost (${formatPercent(loanRate)}) exceeds investment return (${formatPercent(investRate)}) — repay first.`
      });
      break;
    }

    default:
      break;
  }

  return insights.slice(0, 3);
}

export function renderInsightCards(container, insights) {
  container.innerHTML = '';

  if (!insights || insights.length === 0) {
    container.innerHTML = '<div class="insight-card"><div class="insight-text" style="color:var(--text-muted)">Adjust inputs to see insights</div></div>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'insight-grid';

  insights.forEach((insight, i) => {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.style.animationDelay = `${i * 0.1}s`;

    card.innerHTML = `
      <div class="insight-icon ${insight.bgClass || 'accent-bg'}">
        ${INSIGHT_ICONS[insight.icon] || INSIGHT_ICONS.bulb}
      </div>
      <div class="insight-text">${insight.text}</div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}
