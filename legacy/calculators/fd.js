import { formatINR, formatPercent, formatINRFull } from '../utils/formatter.js';
import { fdFV, fdGrowthCurve, rdFV, rdGrowthCurve, safeValue } from '../utils/math.js';
import { createSlider } from '../components/slider.js';
import { animateCounter } from '../components/counter.js';
import { createChart, updateChart, destroyChart, getChartColors } from '../components/chart.js';
import { generateInsights, renderInsightCards } from '../components/insightCards.js';
import { renderBreakdownTable } from '../components/breakdownTable.js';
import { copyResults, showToast } from '../utils/clipboard.js';
import { saveState, loadState } from '../utils/storage.js';

export const id = 'fd';
export const label = 'FD / RD Calculator';
export const shortLabel = 'FD/RD';

export const defaultInputs = {
  principal: 100000,
  rate: 7,
  years: 5,
  compounding: 'M',
  depositType: 'fd'
};

export function calculate(inputs) {
  const p = safeValue(inputs.principal);
  const r = safeValue(inputs.rate);
  const y = safeValue(inputs.years);
  const isRD = inputs.depositType === 'rd';
  const isSimple = inputs.depositType === 'fd-simple' || (inputs.depositType === 'fd' && inputs.isSimple);

  if (isRD) {
    const maturity = safeValue(rdFV(p, y, r));
    const invested = p * y * 12;
    return { maturity: Math.round(maturity), interest: Math.round(Math.max(0, maturity - invested)), principal: p, invested };
  }

  const maturity = safeValue(fdFV(p, r, y, inputs.compounding, isSimple));
  const interest = maturity - p;
  return { maturity: Math.round(maturity), interest: Math.round(Math.max(0, interest)), principal: p };
}

export function insights(result, inputs) {
  const kind = inputs.depositType === 'rd' ? 'rd' : 'fd';
  return generateInsights(kind, result, inputs);
}

export function chartConfig(result, inputs) {
  const c = getChartColors();
  const isRD = inputs.depositType === 'rd';
  const isSimple = inputs.depositType === 'fd-simple' || (inputs.depositType === 'fd' && inputs.isSimple);
  const curve = isRD
    ? rdGrowthCurve(safeValue(inputs.principal), safeValue(inputs.years), safeValue(inputs.rate))
    : fdGrowthCurve(safeValue(inputs.principal), safeValue(inputs.rate), safeValue(inputs.years), inputs.compounding, isSimple);
  return {
    type: 'line',
    data: {
      labels: curve.map(r => `Y${r.year}`),
      datasets: [{
        label: isRD ? 'RD Growth' : 'Corpus Growth',
        data: curve.map(r => r.value),
        borderColor: c.chart4,
        backgroundColor: c.chart1,
        fill: true,
        pointBackgroundColor: c.chart4,
        pointBorderColor: c.chart4
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => formatINRFull(ctx.parsed.y)
          }
        }
      },
      scales: {
        y: { ticks: { callback: (val) => formatINR(val) } }
      }
    }
  };
}

export function breakdown(result, inputs) {
  const isRD = inputs.depositType === 'rd';
  const isSimple = inputs.depositType === 'fd-simple' || (inputs.depositType === 'fd' && inputs.isSimple);
  const curve = isRD
    ? rdGrowthCurve(safeValue(inputs.principal), safeValue(inputs.years), safeValue(inputs.rate))
    : fdGrowthCurve(safeValue(inputs.principal), safeValue(inputs.rate), safeValue(inputs.years), inputs.compounding, isSimple);
  if (isRD) {
    return {
      headers: ['Year', 'Corpus Value', 'Total Deposited'],
      rows: curve.map(r => [
        `Year ${r.year}`,
        formatINRFull(r.value),
        formatINRFull(r.invested)
      ])
    };
  }
  return {
    headers: ['Year', 'Corpus Value', 'Interest Earned'],
    rows: curve.map(r => [
      `Year ${r.year}`,
      formatINRFull(r.value),
      formatINRFull(r.value - inputs.principal)
    ])
  };
}

export function render(container, onStateChange) {
  container.innerHTML = '';

  const saved = loadState('fd');
  const inputs = saved || { ...defaultInputs };

  const section = document.createElement('div');
  section.className = 'calculator-section active';
  section.id = 'calc-fd';

  const compLabels = { M: 'Monthly', Q: 'Quarterly', H: 'Half-Yearly', Y: 'Yearly' };

  section.innerHTML = `
    <div class="gap-section">
      <div class="inputs-grid-3">
        <div class="input-group">
          <label id="fd-principal-label">Principal Amount (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="fd-principal-display" value="${inputs.principal}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Interest Rate (%)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="fd-rate-display" value="${inputs.rate}" inputmode="decimal" />
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="input-group">
          <label>Tenure (years)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="fd-years-display" value="${inputs.years}" inputmode="numeric" />
            <span class="input-suffix">yrs</span>
          </div>
        </div>
      </div>
      <div class="input-group" style="margin-bottom:0.75rem">
        <label>Deposit Type</label>
        <select class="input-pill" id="fd-depositType" style="border-radius:var(--radius-pill)">
          <option value="fd" ${inputs.depositType === 'fd' ? 'selected' : ''}>Fixed Deposit (Compound)</option>
          <option value="fd-simple" ${inputs.depositType === 'fd-simple' ? 'selected' : ''}>Fixed Deposit (Simple)</option>
          <option value="rd" ${inputs.depositType === 'rd' ? 'selected' : ''}>Recurring Deposit (RD)</option>
        </select>
      </div>
      <div class="input-group" style="margin-bottom:0.75rem">
        <label>Compounding Frequency</label>
        <select class="input-pill" id="fd-compounding" style="border-radius:var(--radius-pill)">
          ${Object.entries(compLabels).map(([k, v]) => `<option value="${k}" ${k === inputs.compounding ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </div>
      <div id="fd-slider-principal"></div>
      <div id="fd-slider-rate"></div>
      <div id="fd-slider-years"></div>
    </div>

    <div class="glass-card-elevated gap-section" id="fd-result-card">
      <div class="result-card">
        <div class="result-item">
          <div class="result-label">Maturity Amount</div>
          <div class="result-value accent" id="fd-maturity" data-counter="maturity">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label" id="fd-principal-label-result">Principal</div>
          <div class="result-value" id="fd-principal" data-counter="principal">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Interest Earned</div>
          <div class="result-value positive" id="fd-interest" data-counter="interest">${formatINRFull(0)}</div>
        </div>
      </div>
      <div class="btn-group" style="margin-top:1rem">
        <button class="btn btn-primary btn-sm" id="fd-copy">📋 Copy Result</button>
        <button class="btn btn-secondary btn-sm" id="fd-reset">↺ Reset</button>
      </div>
    </div>

    <div class="glass-card gap-section" id="fd-insights">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Insights</h3>
      <div id="fd-insights-content"></div>
    </div>

    <div class="glass-card chart-card gap-section">
      <div class="chart-title">Growth Curve</div>
      <div class="chart-container chart-container-sm">
        <canvas id="fd-chart"></canvas>
      </div>
    </div>

    <div class="glass-card gap-section">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Yearly Growth</h3>
      <div id="fd-breakdown"></div>
    </div>
  `;

  container.appendChild(section);

  const sliders = {};
  const inputDisplays = {};

  function getInputs() {
    const compEl = document.getElementById('fd-compounding');
    const typeEl = document.getElementById('fd-depositType');
    return {
      principal: sliders.principal ? sliders.principal.getValue() : inputs.principal,
      rate: sliders.rate ? sliders.rate.getValue() : inputs.rate,
      years: sliders.years ? sliders.years.getValue() : inputs.years,
      compounding: compEl ? compEl.value : inputs.compounding,
      depositType: typeEl ? typeEl.value : inputs.depositType
    };
  }

  function updateAll() {
    const vals = getInputs();
    const result = calculate(vals);

    const isRD = vals.depositType === 'rd';
    const principalLabel = document.getElementById('fd-principal-label-result');
    if (principalLabel) principalLabel.textContent = isRD ? 'Total Deposited' : 'Principal';

    animateCounter(document.getElementById('fd-maturity'), 0, result.maturity, 800, formatINRFull);
    animateCounter(document.getElementById('fd-principal'), 0, isRD ? (result.invested || result.principal) : result.principal, 500, formatINRFull);
    animateCounter(document.getElementById('fd-interest'), 0, result.interest, 700, formatINRFull);

    const cfg = chartConfig(result, vals);
    updateChart('fd-chart', cfg.data, cfg.options);

    const bd = breakdown(result, vals);
    renderBreakdownTable(document.getElementById('fd-breakdown'), bd.headers, bd.rows);

    const insightList = insights(result, vals);
    renderInsightCards(document.getElementById('fd-insights-content'), insightList);

    saveState('fd', vals);
    if (onStateChange) onStateChange(result, vals);
  }

  const pSlider = document.getElementById('fd-slider-principal');
  sliders.principal = createSlider({
    id: 'fd-principal', min: 1000, max: 10000000, step: 1000, value: inputs.principal,
    formatter: (v) => formatINR(v),
    onChange: (v) => { inputDisplays.principal.value = v; updateAll(); }
  });
  pSlider.appendChild(sliders.principal.element);

  const rSlider = document.getElementById('fd-slider-rate');
  sliders.rate = createSlider({
    id: 'fd-rate', min: 0.1, max: 50, step: 0.25, value: inputs.rate,
    formatter: (v) => `${v}%`,
    onChange: (v) => { inputDisplays.rate.value = v; updateAll(); }
  });
  rSlider.appendChild(sliders.rate.element);

  const ySlider = document.getElementById('fd-slider-years');
  sliders.years = createSlider({
    id: 'fd-years', min: 1, max: 50, step: 1, value: inputs.years,
    formatter: (v) => `${v} yrs`,
    onChange: (v) => { inputDisplays.years.value = v; updateAll(); }
  });
  ySlider.appendChild(sliders.years.element);

  inputDisplays.principal = document.getElementById('fd-principal-display');
  inputDisplays.rate = document.getElementById('fd-rate-display');
  inputDisplays.years = document.getElementById('fd-years-display');

  inputDisplays.principal.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.principal.value.replace(/,/g, ''));
    if (isNaN(v) || v < 1000) v = 1000;
    if (v > 10000000) v = 10000000;
    inputDisplays.principal.value = v;
    sliders.principal.setValue(v);
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

  document.getElementById('fd-compounding').addEventListener('change', updateAll);

  document.getElementById('fd-depositType').addEventListener('change', () => {
    const val = document.getElementById('fd-depositType').value;
    const label = document.getElementById('fd-principal-label');
    label.textContent = val === 'rd' ? 'Monthly Deposit (₹)' : 'Principal Amount (₹)';
    updateAll();
  });

  document.getElementById('fd-copy').addEventListener('click', () => {
    const vals = getInputs();
    const r = calculate(vals);
    const isRD = vals.depositType === 'rd';
    copyResults({
      'Calculator': isRD ? 'RD Calculator' : 'FD Calculator',
      [isRD ? 'Monthly Deposit' : 'Principal']: formatINRFull(vals.principal),
      'Rate': formatPercent(vals.rate),
      'Tenure': `${vals.years} years`,
      'Compounding': compLabels[vals.compounding] || vals.compounding,
      'Maturity Amount': formatINRFull(r.maturity),
      'Interest Earned': formatINRFull(r.interest)
    });
  });

  document.getElementById('fd-reset').addEventListener('click', () => {
    Object.assign(inputs, defaultInputs);
    sliders.principal.reset(defaultInputs.principal);
    sliders.rate.reset(defaultInputs.rate);
    sliders.years.reset(defaultInputs.years);
    inputDisplays.principal.value = defaultInputs.principal;
    inputDisplays.rate.value = defaultInputs.rate;
    inputDisplays.years.value = defaultInputs.years;
    document.getElementById('fd-compounding').value = defaultInputs.compounding;
    document.getElementById('fd-depositType').value = defaultInputs.depositType;
    document.getElementById('fd-principal-label').textContent = 'Principal Amount (₹)';
    updateAll();
    showToast('Reset to defaults');
  });

  const fc = getChartColors();
  createChart('fd-chart', 'line', {
    labels: ['Y1', 'Y2', 'Y3'],
    datasets: [{ label: 'Growth', data: [1, 1, 1], borderColor: fc.chart4, fill: true, backgroundColor: fc.chart1 }]
  });
  updateAll();

  return {
    id: 'fd',
    destroy: () => { destroyChart('fd-chart'); },
    refresh: () => updateAll()
  };
}
