import { formatINR, formatPercent, formatINRFull } from '../utils/formatter.js';
import { cagr, safeValue } from '../utils/math.js';
import { createSlider } from '../components/slider.js';
import { animateCounter } from '../components/counter.js';
import { createChart, updateChart, destroyChart, getChartColors } from '../components/chart.js';
import { generateInsights, renderInsightCards } from '../components/insightCards.js';
import { renderBreakdownTable } from '../components/breakdownTable.js';
import { copyResults, showToast } from '../utils/clipboard.js';
import { saveState, loadState } from '../utils/storage.js';

export const id = 'cagr';
export const label = 'CAGR Calculator';
export const shortLabel = 'CAGR';

export const defaultInputs = {
  initial: 100000,
  final: 200000,
  years: 5
};

export function calculate(inputs) {
  const initial = safeValue(inputs.initial);
  const final = safeValue(inputs.final);
  const years = safeValue(inputs.years);
  const cagrVal = cagr(initial, final, years);
  const absReturn = initial > 0 ? ((final - initial) / initial) * 100 : 0;
  return {
    cagr: safeValue(cagrVal),
    absReturn: absReturn,
    initial,
    final,
    gain: final - initial
  };
}

export function insights(result, inputs) {
  return generateInsights('cagr', result, inputs);
}

export function chartConfig(result, inputs) {
  const c = getChartColors();
  const years = Array.from({ length: inputs.years }, (_, i) => `Y${i + 1}`);
  const values = [];
  for (let y = 1; y <= inputs.years; y++) {
    values.push(Math.round(inputs.initial * Math.pow(1 + result.cagr, y)));
  }

  return {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Portfolio Value',
        data: values,
        backgroundColor: values.map(v => v >= inputs.initial ? c.chart4 : c.chart2),
        borderRadius: 4
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
  const rows = [];
  for (let y = 1; y <= inputs.years; y++) {
    const val = Math.round(inputs.initial * Math.pow(1 + result.cagr, y));
    const gain = val - inputs.initial;
    rows.push([
      `Year ${y}`,
      formatINRFull(val),
      formatPercent(((val / inputs.initial - 1) * 100)),
      formatINRFull(gain)
    ]);
  }
  return {
    headers: ['Year', 'Value', 'Return %', 'Absolute Gain'],
    rows
  };
}

export function render(container, onStateChange) {
  container.innerHTML = '';

  const saved = loadState('cagr');
  const inputs = saved || { ...defaultInputs };

  const section = document.createElement('div');
  section.className = 'calculator-section active';
  section.id = 'calc-cagr';

  section.innerHTML = `
    <div class="gap-section">
      <div class="inputs-grid-3">
        <div class="input-group">
          <label>Initial Value (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="cagr-initial-display" value="${inputs.initial}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Final Value (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="cagr-final-display" value="${inputs.final}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Duration (years)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="cagr-years-display" value="${inputs.years}" inputmode="numeric" />
            <span class="input-suffix">yrs</span>
          </div>
        </div>
      </div>
      <div id="cagr-slider-initial"></div>
      <div id="cagr-slider-final"></div>
      <div id="cagr-slider-years"></div>
    </div>

    <div class="glass-card-elevated gap-section" id="cagr-result-card">
      <div class="result-card">
        <div class="result-item">
          <div class="result-label">CAGR</div>
          <div class="result-value accent" id="cagr-cagr" data-counter="cagr">0%</div>
        </div>
        <div class="result-item">
          <div class="result-label">Absolute Return</div>
          <div class="result-value positive" id="cagr-abs" data-counter="absReturn">0%</div>
        </div>
        <div class="result-item">
          <div class="result-label">Total Gain</div>
          <div class="result-value" id="cagr-gain" data-counter="gain">${formatINRFull(0)}</div>
        </div>
      </div>
      <div class="btn-group" style="margin-top:1rem">
        <button class="btn btn-primary btn-sm" id="cagr-copy">📋 Copy Result</button>
        <button class="btn btn-secondary btn-sm" id="cagr-reset">↺ Reset</button>
      </div>
    </div>

    <div class="glass-card gap-section" id="cagr-insights">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Insights</h3>
      <div id="cagr-insights-content"></div>
    </div>

    <div class="glass-card chart-card gap-section">
      <div class="chart-title">Year-by-Year Value</div>
      <div class="chart-container chart-container-sm">
        <canvas id="cagr-chart"></canvas>
      </div>
    </div>

    <div class="glass-card gap-section">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Yearly Breakdown</h3>
      <div id="cagr-breakdown"></div>
    </div>
  `;

  container.appendChild(section);

  const sliders = {};
  const inputDisplays = {};

  function getInputs() {
    return {
      initial: sliders.initial ? sliders.initial.getValue() : inputs.initial,
      final: sliders.final ? sliders.final.getValue() : inputs.final,
      years: sliders.years ? sliders.years.getValue() : inputs.years
    };
  }

  function updateAll() {
    const vals = getInputs();
    const result = calculate(vals);

    const pctFormatter = (v) => formatPercent(v);
    animateCounter(document.getElementById('cagr-cagr'), 0, result.cagr * 100, 800, pctFormatter);
    animateCounter(document.getElementById('cagr-abs'), 0, result.absReturn, 700, pctFormatter);
    animateCounter(document.getElementById('cagr-gain'), 0, result.gain, 600, formatINRFull);

    const cfg = chartConfig(result, vals);
    updateChart('cagr-chart', cfg.data, cfg.options);

    const bd = breakdown(result, vals);
    renderBreakdownTable(document.getElementById('cagr-breakdown'), bd.headers, bd.rows);

    const insightList = insights(result, vals);
    renderInsightCards(document.getElementById('cagr-insights-content'), insightList);

    saveState('cagr', vals);
    if (onStateChange) onStateChange(result, vals);
  }

  const iSlider = document.getElementById('cagr-slider-initial');
  sliders.initial = createSlider({
    id: 'cagr-initial', min: 1000, max: 10000000, step: 1000, value: inputs.initial,
    formatter: (v) => formatINR(v),
    onChange: (v) => { inputDisplays.initial.value = v; updateAll(); }
  });
  iSlider.appendChild(sliders.initial.element);

  const fSlider = document.getElementById('cagr-slider-final');
  sliders.final = createSlider({
    id: 'cagr-final', min: 1000, max: 50000000, step: 1000, value: inputs.final,
    formatter: (v) => formatINR(v),
    onChange: (v) => { inputDisplays.final.value = v; updateAll(); }
  });
  fSlider.appendChild(sliders.final.element);

  const ySlider = document.getElementById('cagr-slider-years');
  sliders.years = createSlider({
    id: 'cagr-years', min: 1, max: 50, step: 1, value: inputs.years,
    formatter: (v) => `${v} yrs`,
    onChange: (v) => { inputDisplays.years.value = v; updateAll(); }
  });
  ySlider.appendChild(sliders.years.element);

  inputDisplays.initial = document.getElementById('cagr-initial-display');
  inputDisplays.final = document.getElementById('cagr-final-display');
  inputDisplays.years = document.getElementById('cagr-years-display');

  inputDisplays.initial.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.initial.value.replace(/,/g, ''));
    if (isNaN(v) || v < 1000) v = 1000;
    if (v > 10000000) v = 10000000;
    inputDisplays.initial.value = v;
    sliders.initial.setValue(v);
    updateAll();
  });

  inputDisplays.final.addEventListener('change', () => {
    let v = parseFloat(inputDisplays.final.value.replace(/,/g, ''));
    if (isNaN(v) || v < 1000) v = 1000;
    if (v > 50000000) v = 50000000;
    inputDisplays.final.value = v;
    sliders.final.setValue(v);
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

  document.getElementById('cagr-copy').addEventListener('click', () => {
    const vals = getInputs();
    const r = calculate(vals);
    copyResults({
      'Calculator': 'CAGR Calculator',
      'Initial Value': formatINRFull(vals.initial),
      'Final Value': formatINRFull(vals.final),
      'Duration': `${vals.years} years`,
      'CAGR': formatPercent(r.cagr * 100),
      'Absolute Return': formatPercent(r.absReturn),
      'Total Gain': formatINRFull(r.gain)
    });
  });

  document.getElementById('cagr-reset').addEventListener('click', () => {
    Object.assign(inputs, defaultInputs);
    sliders.initial.reset(defaultInputs.initial);
    sliders.final.reset(defaultInputs.final);
    sliders.years.reset(defaultInputs.years);
    inputDisplays.initial.value = defaultInputs.initial;
    inputDisplays.final.value = defaultInputs.final;
    inputDisplays.years.value = defaultInputs.years;
    updateAll();
    showToast('Reset to defaults');
  });

  const cc = getChartColors();
  createChart('cagr-chart', 'bar', {
    labels: ['Y1', 'Y2', 'Y3'],
    datasets: [{ label: 'Value', data: [1, 1, 1], backgroundColor: cc.chart4 }]
  });
  updateAll();

  return {
    id: 'cagr',
    destroy: () => { destroyChart('cagr-chart'); },
    refresh: () => updateAll()
  };
}
