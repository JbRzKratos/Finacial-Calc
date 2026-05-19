import { formatINR, formatPercent, formatINRFull } from '../utils/formatter.js';
import { taxSaved, safeValue } from '../utils/math.js';
import { createSlider } from '../components/slider.js';
import { animateCounter } from '../components/counter.js';
import { createChart, updateChart, destroyChart, getChartColors } from '../components/chart.js';
import { generateInsights, renderInsightCards } from '../components/insightCards.js';
import { renderBreakdownTable } from '../components/breakdownTable.js';
import { copyResults, showToast } from '../utils/clipboard.js';
import { saveState, loadState } from '../utils/storage.js';

export const id = 'taxSaver';
export const label = 'Tax Saver (80C)';
export const shortLabel = 'Tax';

export const defaultInputs = {
  income: 1200000,
  investment80C: 150000,
  taxRegime: 'new',
  otherDeductions: 0
};

export function calculate(inputs) {
  const income = safeValue(inputs.income);
  const inv80C = safeValue(inputs.investment80C);
  const result = taxSaved(income, inv80C, inputs.taxRegime, safeValue(inputs.otherDeductions));
  return {
    ...result,
    income,
    investment80C: Math.min(inv80C, 150000)
  };
}

export function insights(result, inputs) {
  return generateInsights('taxSaver', result, inputs);
}

export function chartConfig(result) {
  const c = getChartColors();
  const slabData = [];
  if (result.taxWithout > 0) slabData.push({ label: 'Tax Without 80C', value: result.taxWithout });
  slabData.push({ label: 'Tax With 80C', value: result.taxWith });
  if (result.saved > 0) slabData.push({ label: 'Tax Saved', value: result.saved });

  return {
    type: 'bar',
    data: {
      labels: slabData.map(d => d.label),
      datasets: [{
        label: 'Amount (₹)',
        data: slabData.map(d => d.value),
        backgroundColor: [c.chart2, c.chart4, c.chart1],
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => formatINRFull(ctx.parsed.x)
          }
        }
      },
      scales: {
        x: { ticks: { callback: (val) => formatINR(val) } }
      }
    }
  };
}

export function breakdown(result) {
  const effectiveRateBefore = result.income > 0 ? (result.taxWithout / result.income) * 100 : 0;
  const effectiveRateAfter = result.income > 0 ? (result.taxWith / result.income) * 100 : 0;

  return {
    headers: ['Metric', 'Value'],
    rows: [
      ['Annual Income', formatINRFull(result.income)],
      ['80C Investment', formatINRFull(result.investment80C)],
      ['Taxable Income', formatINRFull(result.taxableIncome)],
      ['Tax Without 80C', formatINRFull(result.taxWithout)],
      ['Tax With 80C', formatINRFull(result.taxWith)],
      ['Tax Saved', formatINRFull(result.saved)],
      ['Effective Rate (Before)', formatPercent(effectiveRateBefore)],
      ['Effective Rate (After)', formatPercent(effectiveRateAfter)]
    ]
  };
}

export function render(container, onStateChange) {
  container.innerHTML = '';

  const saved = loadState('taxSaver');
  const inputs = saved || { ...defaultInputs };

  const section = document.createElement('div');
  section.className = 'calculator-section active';
  section.id = 'calc-taxSaver';

  section.innerHTML = `
    <div class="gap-section">
      <div class="inputs-grid-3">
        <div class="input-group">
          <label>Annual Income (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="tax-income-display" value="${inputs.income}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>80C Investments (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="tax-investment-display" value="${inputs.investment80C}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Other Deductions (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="tax-other-display" value="${inputs.otherDeductions}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Tax Regime</label>
          <select class="input-pill" id="tax-regime" style="border-radius:var(--radius-pill)">
            <option value="new" ${inputs.taxRegime === 'new' ? 'selected' : ''}>New Regime</option>
            <option value="old" ${inputs.taxRegime === 'old' ? 'selected' : ''}>Old Regime</option>
          </select>
        </div>
      </div>
      <div id="tax-slider-income"></div>
      <div id="tax-slider-investment"></div>
      <div id="tax-slider-other"></div>
    </div>

    <div class="glass-card-elevated gap-section" id="tax-result-card">
      <div class="result-card">
        <div class="result-item">
          <div class="result-label">Tax Saved</div>
          <div class="result-value positive" id="tax-saved" data-counter="saved">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Tax Without 80C</div>
          <div class="result-value negative" id="tax-without" data-counter="taxWithout">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Tax With 80C</div>
          <div class="result-value" id="tax-with" data-counter="taxWith">${formatINRFull(0)}</div>
        </div>
      </div>
      <div class="btn-group" style="margin-top:1rem">
        <button class="btn btn-primary btn-sm" id="tax-copy">📋 Copy Result</button>
        <button class="btn btn-secondary btn-sm" id="tax-reset">↺ Reset</button>
      </div>
    </div>

    <div class="glass-card gap-section" id="tax-insights">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Insights</h3>
      <div id="tax-insights-content"></div>
    </div>

    <div class="glass-card chart-card gap-section">
      <div class="chart-title">Tax Comparison</div>
      <div class="chart-container chart-container-sm">
        <canvas id="tax-chart"></canvas>
      </div>
    </div>

    <div class="glass-card gap-section">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Tax Breakdown</h3>
      <div id="tax-breakdown"></div>
    </div>
  `;

  container.appendChild(section);

  const sliders = {};
  const inputDisplays = {};

  function getInputs() {
    const regimeEl = document.getElementById('tax-regime');
    return {
      income: sliders.income ? sliders.income.getValue() : inputs.income,
      investment80C: sliders.investment ? sliders.investment.getValue() : inputs.investment80C,
      taxRegime: regimeEl ? regimeEl.value : inputs.taxRegime,
      otherDeductions: sliders.other ? sliders.other.getValue() : inputs.otherDeductions
    };
  }

  function updateAll() {
    const vals = getInputs();
    const result = calculate(vals);

    animateCounter(document.getElementById('tax-saved'), 0, result.saved, 800, formatINRFull);
    animateCounter(document.getElementById('tax-without'), 0, result.taxWithout, 600, formatINRFull);
    animateCounter(document.getElementById('tax-with'), 0, result.taxWith, 700, formatINRFull);

    const cfg = chartConfig(result);
    updateChart('tax-chart', cfg.data, cfg.options);

    const bd = breakdown(result);
    renderBreakdownTable(document.getElementById('tax-breakdown'), bd.headers, bd.rows);

    const insightList = insights(result, vals);
    renderInsightCards(document.getElementById('tax-insights-content'), insightList);

    saveState('taxSaver', vals);
    if (onStateChange) onStateChange(result, vals);
  }

  const iSlider = document.getElementById('tax-slider-income');
  sliders.income = createSlider({
    id: 'tax-income', min: 300000, max: 50000000, step: 50000, value: inputs.income,
    formatter: (v) => formatINR(v),
    onChange: (v) => { inputDisplays.income.value = v; updateAll(); }
  });
  iSlider.appendChild(sliders.income.element);

  const invSlider = document.getElementById('tax-slider-investment');
  sliders.investment = createSlider({
    id: 'tax-investment', min: 0, max: 150000, step: 5000, value: inputs.investment80C,
    formatter: (v) => formatINR(v),
    onChange: (v) => { inputDisplays.investment.value = v; updateAll(); }
  });
  invSlider.appendChild(sliders.investment.element);

  const otherSlider = document.getElementById('tax-slider-other');
  sliders.other = createSlider({
    id: 'tax-other', min: 0, max: 500000, step: 10000, value: inputs.otherDeductions,
    formatter: (v) => formatINR(v),
    onChange: (v) => { inputDisplays.other.value = v; updateAll(); }
  });
  otherSlider.appendChild(sliders.other.element);

  inputDisplays.income = document.getElementById('tax-income-display');
  inputDisplays.investment = document.getElementById('tax-investment-display');
  inputDisplays.other = document.getElementById('tax-other-display');

  inputDisplays.income.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.income.value.replace(/,/g, ''));
    if (isNaN(v) || v < 300000) v = 300000;
    if (v > 50000000) v = 50000000;
    inputDisplays.income.value = v;
    sliders.income.setValue(v);
    updateAll();
  });

  inputDisplays.investment.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.investment.value.replace(/,/g, ''));
    if (isNaN(v) || v < 0) v = 0;
    if (v > 150000) v = 150000;
    inputDisplays.investment.value = v;
    sliders.investment.setValue(v);
    updateAll();
  });

  inputDisplays.other.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.other.value.replace(/,/g, ''));
    if (isNaN(v) || v < 0) v = 0;
    if (v > 500000) v = 500000;
    inputDisplays.other.value = v;
    if (sliders.other) sliders.other.setValue(v);
    updateAll();
  });

  document.getElementById('tax-regime').addEventListener('change', updateAll);

  document.getElementById('tax-copy').addEventListener('click', () => {
    const vals = getInputs();
    const r = calculate(vals);
    copyResults({
      'Calculator': 'Tax Saver 80C',
      'Annual Income': formatINRFull(vals.income),
      '80C Investment': formatINRFull(vals.investment80C),
      'Tax Regime': vals.taxRegime === 'new' ? 'New Regime' : 'Old Regime',
      'Tax Without 80C': formatINRFull(r.taxWithout),
      'Tax With 80C': formatINRFull(r.taxWith),
      'Tax Saved': formatINRFull(r.saved)
    });
  });

  document.getElementById('tax-reset').addEventListener('click', () => {
    Object.assign(inputs, defaultInputs);
    sliders.income.reset(defaultInputs.income);
    sliders.investment.reset(defaultInputs.investment80C);
    if (sliders.other) sliders.other.reset(defaultInputs.otherDeductions);
    inputDisplays.income.value = defaultInputs.income;
    inputDisplays.investment.value = defaultInputs.investment80C;
    inputDisplays.other.value = defaultInputs.otherDeductions;
    document.getElementById('tax-regime').value = defaultInputs.taxRegime;
    updateAll();
    showToast('Reset to defaults');
  });

  const tc = getChartColors();
  createChart('tax-chart', 'bar', {
    labels: ['Tax Without 80C', 'Tax With 80C'],
    datasets: [{ label: 'Tax', data: [1, 1], backgroundColor: [tc.chart2, tc.chart4] }]
  }, { indexAxis: 'y' });
  updateAll();

  return {
    id: 'taxSaver',
    destroy: () => { destroyChart('tax-chart'); },
    refresh: () => updateAll()
  };
}
