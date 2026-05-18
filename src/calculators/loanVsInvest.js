import { formatINR, formatPercent, formatINRFull } from '../utils/formatter.js';
import { loanVsInvest, safeValue } from '../utils/math.js';
import { createSlider } from '../components/slider.js';
import { animateCounter } from '../components/counter.js';
import { createChart, updateChart, destroyChart, getChartColors } from '../components/chart.js';
import { generateInsights, renderInsightCards } from '../components/insightCards.js';
import { renderBreakdownTable } from '../components/breakdownTable.js';
import { copyResults, showToast } from '../utils/clipboard.js';
import { saveState, loadState } from '../utils/storage.js';

export const id = 'loanVsInvest';
export const label = 'Loan vs Invest';
export const shortLabel = 'L vs I';

export const defaultInputs = {
  amount: 1000000,
  loanRate: 10,
  investRate: 12,
  years: 10,
  mode: 'sip'
};

export function calculate(inputs) {
  return loanVsInvest(safeValue(inputs.amount), safeValue(inputs.loanRate), safeValue(inputs.investRate), safeValue(inputs.years), inputs.mode || 'sip');
}

export function insights(result, inputs) {
  return generateInsights('loanVsInvest', result, inputs);
}

export function chartConfig(result) {
  const c = getChartColors();
  return {
    type: 'line',
    data: {
      labels: result.rows.map(r => `Y${r.year}`),
      datasets: [
        {
          label: 'Net Worth (Invest)',
          data: result.rows.map(r => r.investValue),
          borderColor: c.chart1,
          backgroundColor: c.chart1,
          fill: true,
          pointBackgroundColor: c.chart1,
          pointRadius: 3,
          borderWidth: 2
        },
        {
          label: 'Debt Remaining',
          data: result.rows.map(r => r.loanBalance),
          borderColor: c.chart5,
          borderDash: [6, 3],
          pointBackgroundColor: c.chart5,
          pointRadius: 3,
          borderWidth: 2,
          fill: false
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
        y: { ticks: { callback: (val) => formatINR(val) } }
      }
    }
  };
}

export function breakdown(result) {
  return {
    headers: ['Year', 'Debt Remaining', 'Invest Value', 'Total Paid'],
    rows: result.rows.map(r => [
      `Year ${r.year}`,
      formatINRFull(r.loanBalance),
      formatINRFull(r.investValue),
      formatINRFull(r.totalPaid)
    ])
  };
}

export function render(container, onStateChange) {
  container.innerHTML = '';

  const saved = loadState('loanVsInvest');
  const inputs = saved || { ...defaultInputs };

  const section = document.createElement('div');
  section.className = 'calculator-section active';
  section.id = 'calc-loanVsInvest';

  section.innerHTML = `
    <div class="gap-section">
      <div class="inputs-grid-3">
        <div class="input-group">
          <label>Loan / Investment Amount (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="lvi-amount-display" value="${inputs.amount}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Loan Interest Rate (%)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="lvi-loanRate-display" value="${inputs.loanRate}" inputmode="decimal" />
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="input-group">
          <label>Investment Return (%)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="lvi-investRate-display" value="${inputs.investRate}" inputmode="decimal" />
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="input-group">
          <label>Duration (years)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="lvi-years-display" value="${inputs.years}" inputmode="numeric" />
            <span class="input-suffix">yrs</span>
          </div>
        </div>
        <div class="input-group">
          <label>Investment Mode</label>
          <select class="input-pill" id="lvi-mode" style="border-radius:var(--radius-pill)">
            <option value="sip" ${inputs.mode === 'sip' ? 'selected' : ''}>Monthly SIP</option>
            <option value="lumpsum" ${inputs.mode === 'lumpsum' ? 'selected' : ''}>Lump Sum</option>
          </select>
        </div>
      </div>
      <div id="lvi-slider-amount"></div>
      <div id="lvi-slider-loanRate"></div>
      <div id="lvi-slider-investRate"></div>
      <div id="lvi-slider-years"></div>
    </div>

    <div class="glass-card-elevated gap-section" id="lvi-result-card">
      <div class="result-card">
        <div class="result-item">
          <div class="result-label">Final Invest Value</div>
          <div class="result-value positive" id="lvi-investValue" data-counter="finalInvestValue">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Total Interest Paid</div>
          <div class="result-value negative" id="lvi-interest" data-counter="totalInterest">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Net Difference</div>
          <div class="result-value accent" id="lvi-diff">${formatINRFull(0)}</div>
        </div>
      </div>
      <div class="btn-group" style="margin-top:1rem">
        <button class="btn btn-primary btn-sm" id="lvi-copy">📋 Copy Result</button>
        <button class="btn btn-secondary btn-sm" id="lvi-reset">↺ Reset</button>
      </div>
    </div>

    <div class="glass-card gap-section" id="lvi-insights">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Insights</h3>
      <div id="lvi-insights-content"></div>
    </div>

    <div class="glass-card chart-card gap-section">
      <div class="chart-title">Net Worth Comparison</div>
      <div class="chart-container chart-container-sm">
        <canvas id="lvi-chart"></canvas>
      </div>
    </div>

    <div class="glass-card gap-section">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Yearly Comparison</h3>
      <div id="lvi-breakdown"></div>
    </div>
  `;

  container.appendChild(section);

  const sliders = {};
  const inputDisplays = {};

  function getInputs() {
    const modeEl = document.getElementById('lvi-mode');
    return {
      amount: sliders.amount ? sliders.amount.getValue() : inputs.amount,
      loanRate: sliders.loanRate ? sliders.loanRate.getValue() : inputs.loanRate,
      investRate: sliders.investRate ? sliders.investRate.getValue() : inputs.investRate,
      years: sliders.years ? sliders.years.getValue() : inputs.years,
      mode: modeEl ? modeEl.value : inputs.mode
    };
  }

  function updateAll() {
    const vals = getInputs();
    const result = calculate(vals);

    animateCounter(document.getElementById('lvi-investValue'), 0, result.finalInvestValue, 800, formatINRFull);
    animateCounter(document.getElementById('lvi-interest'), 0, result.totalInterest, 700, formatINRFull);

    const diff = result.finalInvestValue - result.totalInterest;
    const diffEl = document.getElementById('lvi-diff');
    diffEl.textContent = formatINRFull(Math.abs(diff));
    diffEl.className = `result-value ${diff >= 0 ? 'positive' : 'negative'}`;

    const cfg = chartConfig(result);
    updateChart('lvi-chart', cfg.data, cfg.options);

    const bd = breakdown(result);
    renderBreakdownTable(document.getElementById('lvi-breakdown'), bd.headers, bd.rows);

    const insightList = insights(result, vals);
    renderInsightCards(document.getElementById('lvi-insights-content'), insightList);

    saveState('loanVsInvest', vals);
    if (onStateChange) onStateChange(result, vals);
  }

  const aSlider = document.getElementById('lvi-slider-amount');
  sliders.amount = createSlider({
    id: 'lvi-amount', min: 10000, max: 10000000, step: 10000, value: inputs.amount,
    formatter: (v) => formatINR(v),
    onChange: (v) => { inputDisplays.amount.value = v; updateAll(); }
  });
  aSlider.appendChild(sliders.amount.element);

  const lrSlider = document.getElementById('lvi-slider-loanRate');
  sliders.loanRate = createSlider({
    id: 'lvi-loanRate', min: 0.1, max: 50, step: 0.25, value: inputs.loanRate,
    formatter: (v) => `${v}%`,
    onChange: (v) => { inputDisplays.loanRate.value = v; updateAll(); }
  });
  lrSlider.appendChild(sliders.loanRate.element);

  const irSlider = document.getElementById('lvi-slider-investRate');
  sliders.investRate = createSlider({
    id: 'lvi-investRate', min: 0.1, max: 50, step: 0.25, value: inputs.investRate,
    formatter: (v) => `${v}%`,
    onChange: (v) => { inputDisplays.investRate.value = v; updateAll(); }
  });
  irSlider.appendChild(sliders.investRate.element);

  const ySlider = document.getElementById('lvi-slider-years');
  sliders.years = createSlider({
    id: 'lvi-years', min: 1, max: 50, step: 1, value: inputs.years,
    formatter: (v) => `${v} yrs`,
    onChange: (v) => { inputDisplays.years.value = v; updateAll(); }
  });
  ySlider.appendChild(sliders.years.element);

  inputDisplays.amount = document.getElementById('lvi-amount-display');
  inputDisplays.loanRate = document.getElementById('lvi-loanRate-display');
  inputDisplays.investRate = document.getElementById('lvi-investRate-display');
  inputDisplays.years = document.getElementById('lvi-years-display');

  inputDisplays.amount.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.amount.value.replace(/,/g, ''));
    if (isNaN(v) || v < 10000) v = 10000;
    if (v > 10000000) v = 10000000;
    inputDisplays.amount.value = v;
    sliders.amount.setValue(v);
    updateAll();
  });

  inputDisplays.loanRate.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.loanRate.value);
    if (isNaN(v) || v < 0.1) v = 0.1;
    if (v > 50) v = 50;
    inputDisplays.loanRate.value = v;
    sliders.loanRate.setValue(v);
    updateAll();
  });

  inputDisplays.investRate.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.investRate.value);
    if (isNaN(v) || v < 0.1) v = 0.1;
    if (v > 50) v = 50;
    inputDisplays.investRate.value = v;
    sliders.investRate.setValue(v);
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

  document.getElementById('lvi-mode').addEventListener('change', updateAll);

  document.getElementById('lvi-copy').addEventListener('click', () => {
    const vals = getInputs();
    const r = calculate(vals);
    const diff = r.finalInvestValue - r.totalInterest;
    copyResults({
      'Calculator': 'Loan vs Invest',
      'Amount': formatINRFull(vals.amount),
      'Loan Rate': formatPercent(vals.loanRate),
      'Invest Return': formatPercent(vals.investRate),
      'Duration': `${vals.years} years`,
      'Final Invest Value': formatINRFull(r.finalInvestValue),
      'Total Interest Paid': formatINRFull(r.totalInterest),
      'Difference': formatINRFull(Math.abs(diff)) + (diff >= 0 ? ' (Invest wins)' : ' (Repay wins)')
    });
  });

  document.getElementById('lvi-reset').addEventListener('click', () => {
    Object.assign(inputs, defaultInputs);
    sliders.amount.reset(defaultInputs.amount);
    sliders.loanRate.reset(defaultInputs.loanRate);
    sliders.investRate.reset(defaultInputs.investRate);
    sliders.years.reset(defaultInputs.years);
    inputDisplays.amount.value = defaultInputs.amount;
    inputDisplays.loanRate.value = defaultInputs.loanRate;
    inputDisplays.investRate.value = defaultInputs.investRate;
    inputDisplays.years.value = defaultInputs.years;
    document.getElementById('lvi-mode').value = defaultInputs.mode;
    updateAll();
    showToast('Reset to defaults');
  });

  const lc = getChartColors();
  createChart('lvi-chart', 'line', {
    labels: ['Y1', 'Y2', 'Y3'],
    datasets: [
      { label: 'Invest', data: [1, 1, 1], borderColor: lc.chart1, fill: true, backgroundColor: lc.chart1 },
      { label: 'Debt', data: [1, 1, 1], borderColor: lc.chart5, borderDash: [6, 3], fill: false }
    ]
  });
  updateAll();

  return {
    id: 'loanVsInvest',
    destroy: () => { destroyChart('lvi-chart'); },
    refresh: () => updateAll()
  };
}
