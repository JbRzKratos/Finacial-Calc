import { formatINR, formatPercent, formatINRFull } from '../utils/formatter.js';
import { emiPMT, emiAmortization, safeValue } from '../utils/math.js';
import { createSlider } from '../components/slider.js';
import { animateCounter } from '../components/counter.js';
import { createChart, updateChart, destroyChart, getChartColors } from '../components/chart.js';
import { generateInsights, renderInsightCards } from '../components/insightCards.js';
import { renderBreakdownTable } from '../components/breakdownTable.js';
import { copyResults, showToast } from '../utils/clipboard.js';
import { saveState, loadState } from '../utils/storage.js';

export const id = 'emi';
export const label = 'EMI Calculator';
export const shortLabel = 'EMI';

export const defaultInputs = {
  amount: 1000000,
  rate: 9,
  years: 5
};

export function calculate(inputs) {
  const months = safeValue(inputs.years) * 12;
  const emi = safeValue(emiPMT(safeValue(inputs.amount), safeValue(inputs.rate), months));
  const totalPayment = emi * months;
  const totalInterest = totalPayment - safeValue(inputs.amount);
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principal: safeValue(inputs.amount)
  };
}

export function insights(result, inputs) {
  return generateInsights('emi', result, inputs);
}

export function chartConfig(result) {
  const c = getChartColors();
  const schedule = emiAmortization(result.principal, inputsCache.rate, inputsCache.years * 12);
  const years = schedule.map(r => `Y${r.year}`);
  const principalData = schedule.map(r => r.principal);
  const interestData = schedule.map(r => r.interest);

  return {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Principal',
          data: principalData,
          backgroundColor: c.chart4,
          borderRadius: 4
        },
        {
          label: 'Interest',
          data: interestData,
          backgroundColor: c.chart2,
          borderRadius: 4
        }
      ]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatINRFull(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, ticks: { callback: (val) => formatINR(val) } }
      }
    }
  };
}

let inputsCache = { amount: 1000000, rate: 9, years: 5 };

export function breakdown(result, inputs) {
  inputsCache = inputs;
  const schedule = emiAmortization(inputs.amount, inputs.rate, inputs.years * 12);
  return {
    headers: ['Year', 'Opening', 'Principal Paid', 'Interest Paid', 'Total Paid', 'Balance'],
    rows: schedule.map(r => [
      `Year ${r.year}`,
      formatINRFull(r.opening),
      formatINRFull(r.principal),
      formatINRFull(r.interest),
      formatINRFull(r.total),
      formatINRFull(r.balance)
    ])
  };
}

export function render(container, onStateChange) {
  container.innerHTML = '';

  const saved = loadState('emi');
  const inputs = saved || { ...defaultInputs };
  inputsCache = { ...inputs };

  const section = document.createElement('div');
  section.className = 'calculator-section active';
  section.id = 'calc-emi';

  section.innerHTML = `
    <div class="gap-section">
      <div class="inputs-grid-3">
        <div class="input-group">
          <label>Loan Amount (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="emi-amount-display" value="${inputs.amount}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Interest Rate (%)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="emi-rate-display" value="${inputs.rate}" inputmode="decimal" />
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="input-group">
          <label>Loan Tenure (years)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="emi-years-display" value="${inputs.years}" inputmode="numeric" />
            <span class="input-suffix">yrs</span>
          </div>
        </div>
      </div>
      <div id="emi-slider-amount"></div>
      <div id="emi-slider-rate"></div>
      <div id="emi-slider-years"></div>
    </div>

    <div class="glass-card-elevated gap-section" id="emi-result-card">
      <div class="result-card">
        <div class="result-item">
          <div class="result-label">Monthly EMI</div>
          <div class="result-value accent" id="emi-emi" data-counter="emi">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Total Interest</div>
          <div class="result-value negative" id="emi-interest" data-counter="totalInterest">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Total Payment</div>
          <div class="result-value" id="emi-total" data-counter="totalPayment">${formatINRFull(0)}</div>
        </div>
      </div>
      <div class="btn-group" style="margin-top:1rem">
        <button class="btn btn-primary btn-sm" id="emi-copy">📋 Copy Result</button>
        <button class="btn btn-secondary btn-sm" id="emi-reset">↺ Reset</button>
      </div>
    </div>

    <div class="glass-card gap-section" id="emi-insights">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Insights</h3>
      <div id="emi-insights-content"></div>
    </div>

    <div class="glass-card chart-card gap-section">
      <div class="chart-title">Principal vs Interest Per Year</div>
      <div class="chart-container chart-container-sm">
        <canvas id="emi-chart"></canvas>
      </div>
    </div>

    <div class="glass-card gap-section">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Yearly Amortization Schedule</h3>
      <div id="emi-breakdown"></div>
    </div>
  `;

  container.appendChild(section);

  const sliders = {};
  const inputDisplays = {};

  function getInputs() {
    return {
      amount: sliders.amount ? sliders.amount.getValue() : inputs.amount,
      rate: sliders.rate ? sliders.rate.getValue() : inputs.rate,
      years: sliders.years ? sliders.years.getValue() : inputs.years
    };
  }

  function updateAll() {
    const vals = getInputs();
    inputsCache = { ...vals };
    const result = calculate(vals);

    animateCounter(document.getElementById('emi-emi'), 0, result.emi, 800, formatINRFull);
    animateCounter(document.getElementById('emi-interest'), 0, result.totalInterest, 700, formatINRFull);
    animateCounter(document.getElementById('emi-total'), 0, result.totalPayment, 600, formatINRFull);

    const cfg = chartConfig(result);
    updateChart('emi-chart', cfg.data, cfg.options);

    const bd = breakdown(result, vals);
    renderBreakdownTable(document.getElementById('emi-breakdown'), bd.headers, bd.rows);

    const insightList = insights(result, vals);
    renderInsightCards(document.getElementById('emi-insights-content'), insightList);

    saveState('emi', vals);
    if (onStateChange) onStateChange(result, vals);
  }

  const amountSlider = document.getElementById('emi-slider-amount');
  sliders.amount = createSlider({
    id: 'emi-amount', min: 10000, max: 50000000, step: 10000, value: inputs.amount,
    formatter: (v) => formatINR(v),
    onChange: (v) => { inputDisplays.amount.value = v; updateAll(); }
  });
  amountSlider.appendChild(sliders.amount.element);

  const rateSlider = document.getElementById('emi-slider-rate');
  sliders.rate = createSlider({
    id: 'emi-rate', min: 0.1, max: 50, step: 0.25, value: inputs.rate,
    formatter: (v) => `${v}%`,
    onChange: (v) => { inputDisplays.rate.value = v; updateAll(); }
  });
  rateSlider.appendChild(sliders.rate.element);

  const yearsSlider = document.getElementById('emi-slider-years');
  sliders.years = createSlider({
    id: 'emi-years', min: 1, max: 50, step: 1, value: inputs.years,
    formatter: (v) => `${v} yrs`,
    onChange: (v) => { inputDisplays.years.value = v; updateAll(); }
  });
  yearsSlider.appendChild(sliders.years.element);

  inputDisplays.amount = document.getElementById('emi-amount-display');
  inputDisplays.rate = document.getElementById('emi-rate-display');
  inputDisplays.years = document.getElementById('emi-years-display');

  inputDisplays.amount.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.amount.value.replace(/,/g, ''));
    if (isNaN(v) || v < 10000) v = 10000;
    if (v > 50000000) v = 50000000;
    inputDisplays.amount.value = v;
    sliders.amount.setValue(v);
    updateAll();
  });

  inputDisplays.rate.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.rate.value);
    if (isNaN(v) || v < 0.1) v = 0.1;
    if (v > 50) v = 50;
    inputDisplays.rate.value = v;
    sliders.rate.setValue(v);
    updateAll();
  });

  inputDisplays.years.addEventListener('change', () => {
    let v = parseInt(inputDisplays.years.value);
    if (isNaN(v) || v < 1) v = 1;
    if (v > 50) v = 50;
    inputDisplays.years.value = v;
    sliders.years.setValue(v);
    updateAll();
  });

  document.getElementById('emi-copy').addEventListener('click', () => {
    const vals = getInputs();
    const r = calculate(vals);
    copyResults({
      'Calculator': 'EMI Calculator',
      'Loan Amount': formatINRFull(vals.amount),
      'Interest Rate': formatPercent(vals.rate),
      'Tenure': `${vals.years} years`,
      'Monthly EMI': formatINRFull(r.emi),
      'Total Interest': formatINRFull(r.totalInterest),
      'Total Payment': formatINRFull(r.totalPayment)
    });
  });

  document.getElementById('emi-reset').addEventListener('click', () => {
    Object.assign(inputs, defaultInputs);
    sliders.amount.reset(defaultInputs.amount);
    sliders.rate.reset(defaultInputs.rate);
    sliders.years.reset(defaultInputs.years);
    inputDisplays.amount.value = defaultInputs.amount;
    inputDisplays.rate.value = defaultInputs.rate;
    inputDisplays.years.value = defaultInputs.years;
    updateAll();
    showToast('Reset to defaults');
  });

  const ec = getChartColors();
  createChart('emi-chart', 'bar', {
    labels: ['Y1', 'Y2', 'Y3'],
    datasets: [
      { label: 'Principal', data: [1, 1, 1], backgroundColor: ec.chart4 },
      { label: 'Interest', data: [1, 1, 1], backgroundColor: ec.chart2 }
    ]
  }, { scales: { x: { stacked: true }, y: { stacked: true } } });
  updateAll();

  return {
    id: 'emi',
    destroy: () => { destroyChart('emi-chart'); },
    refresh: () => updateAll()
  };
}
