import { formatINR, formatPercent, formatINRFull } from '../utils/formatter.js';
import { sipFV, sipYearlyBreakdown, ruleOf72, safeValue } from '../utils/math.js';
import { createSlider } from '../components/slider.js';
import { animateCounter } from '../components/counter.js';
import { createChart, updateChart, destroyChart, getChartColors } from '../components/chart.js';
import { generateInsights, renderInsightCards } from '../components/insightCards.js';
import { renderBreakdownTable } from '../components/breakdownTable.js';
import { copyResults, showToast } from '../utils/clipboard.js';
import { saveState, loadState } from '../utils/storage.js';

export const id = 'sip';
export const label = 'SIP Calculator';
export const shortLabel = 'SIP';

export const defaultInputs = {
  amount: 5000,
  years: 10,
  rate: 12
};

export function calculate(inputs) {
  const months = safeValue(inputs.years) * 12;
  const maturity = safeValue(sipFV(safeValue(inputs.amount), months, safeValue(inputs.rate)));
  const invested = safeValue(inputs.amount) * months;
  const returns = maturity - invested;
  return { maturity: Math.round(maturity), invested: Math.round(invested), returns: Math.round(Math.max(0, returns)) };
}

export function insights(result, inputs) {
  return generateInsights('sip', result, inputs);
}

export function chartConfig(result) {
  const c = getChartColors();
  return {
    type: 'doughnut',
    data: {
      labels: ['Principal', 'Returns'],
      datasets: [{
        data: [result.invested, result.returns],
        backgroundColor: [c.chart4, c.chart2],
        borderColor: [c.chart1, c.chart3],
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
              return `${ctx.label}: ${formatINRFull(ctx.parsed)} (${pct}%)`;
            }
          }
        }
      }
    }
  };
}

export function breakdown(result, inputs) {
  const rows = sipYearlyBreakdown(inputs.amount, inputs.years, inputs.rate);
  return {
    headers: ['Year', 'Invested', 'Returns', 'Corpus'],
    rows: rows.map(r => [r.year, formatINRFull(r.invested), formatINRFull(r.returns), formatINRFull(r.corpus)])
  };
}

export function render(container, onStateChange) {
  container.innerHTML = '';

  const section = document.createElement('div');
  section.className = 'calculator-section active';
  section.id = 'calc-sip';

  const saved = loadState('sip');
  const inputs = saved || { ...defaultInputs };

  section.innerHTML = `
    <div class="gap-section">
      <div class="inputs-grid-3">
        <div class="input-group">
          <label>Monthly Investment (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="sip-amount-display" value="${inputs.amount}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Investment Duration (years)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="sip-years-display" value="${inputs.years}" inputmode="numeric" />
            <span class="input-suffix">yrs</span>
          </div>
        </div>
        <div class="input-group">
          <label>Expected Return (%)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="sip-rate-display" value="${inputs.rate}" inputmode="decimal" />
            <span class="input-suffix">%</span>
          </div>
        </div>
      </div>
      <div id="sip-slider-amount"></div>
      <div id="sip-slider-years"></div>
      <div id="sip-slider-rate"></div>
    </div>

    <div class="glass-card-elevated gap-section" id="sip-result-card">
      <div class="result-card">
        <div class="result-item">
          <div class="result-label">Maturity Amount</div>
          <div class="result-value accent" id="sip-maturity" data-counter="maturity">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Invested Amount</div>
          <div class="result-value" id="sip-invested" data-counter="invested">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Est. Returns</div>
          <div class="result-value positive" id="sip-returns" data-counter="returns">${formatINRFull(0)}</div>
        </div>
      </div>
      <div class="btn-group" style="margin-top:1rem">
        <button class="btn btn-primary btn-sm" id="sip-copy">📋 Copy Result</button>
        <button class="btn btn-secondary btn-sm" id="sip-reset">↺ Reset</button>
      </div>
    </div>

    <div class="glass-card gap-section" id="sip-insights">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Insights</h3>
      <div id="sip-insights-content"></div>
    </div>

    <div class="glass-card chart-card gap-section">
      <div class="chart-title">Portfolio Breakdown</div>
      <div class="chart-container chart-container-sm" style="position:relative">
        <canvas id="sip-chart"></canvas>
      </div>
    </div>

    <div class="glass-card gap-section">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Year-by-Year Growth</h3>
      <div id="sip-breakdown"></div>
    </div>
  `;

  container.appendChild(section);

  const sliders = {};
  const inputDisplays = {};

  function getInputs() {
    return {
      amount: sliders.amount ? sliders.amount.getValue() : inputs.amount,
      years: sliders.years ? sliders.years.getValue() : inputs.years,
      rate: sliders.rate ? sliders.rate.getValue() : inputs.rate
    };
  }

  function updateAll() {
    const vals = getInputs();
    const result = calculate(vals);

    animateCounter(document.getElementById('sip-maturity'), 0, result.maturity, 800, formatINRFull);
    animateCounter(document.getElementById('sip-invested'), 0, result.invested, 600, formatINRFull);
    animateCounter(document.getElementById('sip-returns'), 0, result.returns, 700, formatINRFull);

    const cfg = chartConfig(result);
    updateChart('sip-chart', cfg.data, cfg.options);

    const bd = breakdown(result, vals);
    const bdContainer = document.getElementById('sip-breakdown');
    renderBreakdownTable(bdContainer, bd.headers, bd.rows);

    const insightList = insights(result, vals);
    const insightContainer = document.getElementById('sip-insights-content');
    renderInsightCards(insightContainer, insightList);

    saveState('sip', vals);
    if (onStateChange) onStateChange(result, vals);
  }

  const amountSliderContainer = document.getElementById('sip-slider-amount');
  sliders.amount = createSlider({
    id: 'sip-amount',
    min: 500, max: 100000, step: 500, value: inputs.amount,
    formatter: (v) => formatINR(v),
    onChange: (v) => {
      inputDisplays.amount.value = v;
      updateAll();
    }
  });
  amountSliderContainer.appendChild(sliders.amount.element);

  const yearsSliderContainer = document.getElementById('sip-slider-years');
  sliders.years = createSlider({
    id: 'sip-years',
    min: 1, max: 50, step: 1, value: inputs.years,
    formatter: (v) => `${v} yrs`,
    onChange: (v) => {
      inputDisplays.years.value = v;
      updateAll();
    }
  });
  yearsSliderContainer.appendChild(sliders.years.element);

  const rateSliderContainer = document.getElementById('sip-slider-rate');
  sliders.rate = createSlider({
    id: 'sip-rate',
    min: 0.1, max: 50, step: 0.25, value: inputs.rate,
    formatter: (v) => `${v}%`,
    onChange: (v) => {
      inputDisplays.rate.value = v;
      updateAll();
    }
  });
  rateSliderContainer.appendChild(sliders.rate.element);

  inputDisplays.amount = document.getElementById('sip-amount-display');
  inputDisplays.years = document.getElementById('sip-years-display');
  inputDisplays.rate = document.getElementById('sip-rate-display');

  inputDisplays.amount.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.amount.value.replace(/,/g, ''));
    if (isNaN(v) || v < 500) v = 500;
    if (v > 100000) v = 100000;
    inputDisplays.amount.value = v;
    sliders.amount.setValue(v);
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

  inputDisplays.rate.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.rate.value);
    if (isNaN(v) || v < 0.1) v = 0.1;
    if (v > 50) v = 50;
    inputDisplays.rate.value = v;
    sliders.rate.setValue(v);
    updateAll();
  });

  document.getElementById('sip-copy').addEventListener('click', () => {
    const vals = getInputs();
    const r = calculate(vals);
    copyResults({
      'Calculator': 'SIP Calculator',
      'Monthly Investment': formatINRFull(vals.amount),
      'Duration': `${vals.years} years`,
      'Expected Return': formatPercent(vals.rate),
      'Invested Amount': formatINRFull(r.invested),
      'Est. Returns': formatINRFull(r.returns),
      'Maturity Amount': formatINRFull(r.maturity)
    });
  });

  document.getElementById('sip-reset').addEventListener('click', () => {
    Object.assign(inputs, defaultInputs);
    sliders.amount.reset(defaultInputs.amount);
    sliders.years.reset(defaultInputs.years);
    sliders.rate.reset(defaultInputs.rate);
    inputDisplays.amount.value = defaultInputs.amount;
    inputDisplays.years.value = defaultInputs.years;
    inputDisplays.rate.value = defaultInputs.rate;
    updateAll();
    showToast('Reset to defaults');
  });

  createChart('sip-chart', 'doughnut', { labels: ['Principal', 'Returns'], datasets: [{ data: [1, 1] }] });
  updateAll();

  return {
    id: 'sip',
    destroy: () => {
      destroyChart('sip-chart');
    },
    refresh: () => updateAll()
  };
}
