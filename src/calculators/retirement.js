import { formatINR, formatPercent, formatINRFull } from '../utils/formatter.js';
import { retirementCorpus, retirementGrowthCurve, safeValue } from '../utils/math.js';
import { createSlider } from '../components/slider.js';
import { animateCounter } from '../components/counter.js';
import { createChart, updateChart, destroyChart, getChartColors } from '../components/chart.js';
import { generateInsights, renderInsightCards } from '../components/insightCards.js';
import { renderBreakdownTable } from '../components/breakdownTable.js';
import { copyResults, showToast } from '../utils/clipboard.js';
import { saveState, loadState } from '../utils/storage.js';

export const id = 'retirement';
export const label = 'Retirement Planner';
export const shortLabel = 'Retire';

export const defaultInputs = {
  currentAge: 30,
  retireAge: 60,
  lifeExpectancy: 85,
  monthlyExpenses: 50000,
  inflationRate: 6,
  returnRate: 10
};

export function calculate(inputs) {
  return retirementCorpus(
    safeValue(inputs.currentAge), safeValue(inputs.retireAge), safeValue(inputs.lifeExpectancy),
    safeValue(inputs.monthlyExpenses), safeValue(inputs.inflationRate), safeValue(inputs.returnRate)
  );
}

export function insights(result, inputs) {
  return generateInsights('retirement', result, inputs);
}

export function chartConfig(result, inputs) {
  const c = getChartColors();
  const curve = retirementGrowthCurve(
    inputs.currentAge, inputs.retireAge, inputs.lifeExpectancy,
    inputs.monthlyExpenses, inputs.inflationRate, inputs.returnRate
  );

  return {
    type: 'line',
    data: {
      labels: curve.map(r => r.year),
      datasets: [{
        label: 'Corpus',
        data: curve.map(r => r.value),
        borderColor: c.chart2,
        backgroundColor: c.chart1,
        fill: true,
        pointBackgroundColor: (ctx) => {
          const d = curve[ctx.dataIndex];
          return d && d.type === 'withdrawal' ? c.chart5 : c.chart2;
        },
        pointRadius: 3,
        pointBorderColor: 'transparent'
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = curve[ctx.dataIndex];
              const prefix = d && d.type === 'withdrawal' ? 'Withdrawal: ' : 'Corpus: ';
              return `${prefix}${formatINRFull(ctx.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: { title: { display: true, text: 'Age', color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() } },
        y: { ticks: { callback: (val) => formatINR(val) } }
      }
    }
  };
}

export function breakdown(result, inputs) {
  const curve = retirementGrowthCurve(
    inputs.currentAge, inputs.retireAge, inputs.lifeExpectancy,
    inputs.monthlyExpenses, inputs.inflationRate, inputs.returnRate
  );

  return {
    headers: ['Age', 'Status', 'Corpus'],
    rows: curve.map(r => [r.year, r.type === 'accumulation' ? 'Saving' : 'Spending', formatINRFull(r.value)])
  };
}

export function render(container, onStateChange) {
  container.innerHTML = '';

  const saved = loadState('retirement');
  const inputs = saved || { ...defaultInputs };

  const section = document.createElement('div');
  section.className = 'calculator-section active';
  section.id = 'calc-retirement';

  section.innerHTML = `
    <div class="gap-section">
      <div class="inputs-grid-3">
        <div class="input-group">
          <label>Current Age</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="ret-currentAge-display" value="${inputs.currentAge}" inputmode="numeric" />
            <span class="input-suffix">yrs</span>
          </div>
        </div>
        <div class="input-group">
          <label>Retirement Age</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="ret-retireAge-display" value="${inputs.retireAge}" inputmode="numeric" />
            <span class="input-suffix">yrs</span>
          </div>
        </div>
        <div class="input-group">
          <label>Life Expectancy</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="ret-lifeExpectancy-display" value="${inputs.lifeExpectancy}" inputmode="numeric" />
            <span class="input-suffix">yrs</span>
          </div>
        </div>
        <div class="input-group">
          <label>Monthly Expenses (₹)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="ret-monthlyExpenses-display" value="${inputs.monthlyExpenses}" inputmode="numeric" />
            <span class="input-suffix">₹</span>
          </div>
        </div>
        <div class="input-group">
          <label>Inflation Rate (%)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="ret-inflationRate-display" value="${inputs.inflationRate}" inputmode="decimal" />
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="input-group">
          <label>Expected Return (%)</label>
          <div class="input-with-suffix">
            <input type="text" class="input-pill" id="ret-returnRate-display" value="${inputs.returnRate}" inputmode="decimal" />
            <span class="input-suffix">%</span>
          </div>
        </div>
      </div>
      <div id="ret-slider-currentAge"></div>
      <div id="ret-slider-retireAge"></div>
      <div id="ret-slider-monthlyExpenses"></div>
      <div id="ret-slider-inflationRate"></div>
      <div id="ret-slider-returnRate"></div>
    </div>

    <div class="glass-card-elevated gap-section" id="ret-result-card">
      <div class="result-card">
        <div class="result-item">
          <div class="result-label">Corpus Required</div>
          <div class="result-value accent" id="ret-corpus" data-counter="corpus">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Monthly SIP Needed</div>
          <div class="result-value" id="ret-monthlySIP" data-counter="monthlySIP">${formatINRFull(0)}</div>
        </div>
        <div class="result-item">
          <div class="result-label">Expenses at Retirement</div>
          <div class="result-value" id="ret-expenseAtRetire" data-counter="monthlyExpenseAtRetire">${formatINRFull(0)}</div>
        </div>
      </div>
      <div class="btn-group" style="margin-top:1rem">
        <button class="btn btn-primary btn-sm" id="ret-copy">📋 Copy Result</button>
        <button class="btn btn-secondary btn-sm" id="ret-reset">↺ Reset</button>
      </div>
    </div>

    <div class="glass-card gap-section" id="ret-insights">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Insights</h3>
      <div id="ret-insights-content"></div>
    </div>

    <div class="glass-card chart-card gap-section">
      <div class="chart-title">Corpus Growth Over Time</div>
      <div class="chart-container chart-container-lg">
        <canvas id="ret-chart"></canvas>
      </div>
    </div>

    <div class="glass-card gap-section">
      <h3 style="font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Annual Projection</h3>
      <div id="ret-breakdown"></div>
    </div>
  `;

  container.appendChild(section);

  const sliders = {};
  const inputDisplays = {};

  function getInputs() {
    return {
      currentAge: sliders.currentAge ? sliders.currentAge.getValue() : inputs.currentAge,
      retireAge: sliders.retireAge ? sliders.retireAge.getValue() : inputs.retireAge,
      lifeExpectancy: sliders.lifeExpectancy ? sliders.lifeExpectancy.getValue() : inputs.lifeExpectancy,
      monthlyExpenses: sliders.monthlyExpenses ? sliders.monthlyExpenses.getValue() : inputs.monthlyExpenses,
      inflationRate: sliders.inflationRate ? sliders.inflationRate.getValue() : inputs.inflationRate,
      returnRate: sliders.returnRate ? sliders.returnRate.getValue() : inputs.returnRate
    };
  }

  function updateAll() {
    const vals = getInputs();
    const result = calculate(vals);

    animateCounter(document.getElementById('ret-corpus'), 0, result.corpus, 800, formatINRFull);
    animateCounter(document.getElementById('ret-monthlySIP'), 0, result.monthlySIP, 700, formatINRFull);
    animateCounter(document.getElementById('ret-expenseAtRetire'), 0, result.monthlyExpenseAtRetire, 600, formatINRFull);

    const cfg = chartConfig(result, vals);
    updateChart('ret-chart', cfg.data, cfg.options);

    const bd = breakdown(result, vals);
    renderBreakdownTable(document.getElementById('ret-breakdown'), bd.headers, bd.rows);

    const insightList = insights(result, vals);
    renderInsightCards(document.getElementById('ret-insights-content'), insightList);

    saveState('retirement', vals);
    if (onStateChange) onStateChange(result, vals);
  }

  function makeSlider(id, opts, displayEl) {
    const el = document.getElementById(id);
    const s = createSlider(opts);
    el.appendChild(s.element);
    return s;
  }

  const sliderDefs = [
    { id: 'ret-slider-currentAge', key: 'currentAge', min: 18, max: 70, step: 1, formatter: (v) => `${v} yrs` },
    { id: 'ret-slider-retireAge', key: 'retireAge', min: 30, max: 75, step: 1, formatter: (v) => `${v} yrs` },
    { id: 'ret-slider-monthlyExpenses', key: 'monthlyExpenses', min: 5000, max: 500000, step: 1000, formatter: (v) => formatINR(v) },
    { id: 'ret-slider-inflationRate', key: 'inflationRate', min: 0.1, max: 50, step: 0.25, formatter: (v) => `${v}%` },
    { id: 'ret-slider-returnRate', key: 'returnRate', min: 0.1, max: 50, step: 0.25, formatter: (v) => `${v}%` }
  ];

  inputDisplays.currentAge = document.getElementById('ret-currentAge-display');
  inputDisplays.retireAge = document.getElementById('ret-retireAge-display');
  inputDisplays.lifeExpectancy = document.getElementById('ret-lifeExpectancy-display');
  inputDisplays.monthlyExpenses = document.getElementById('ret-monthlyExpenses-display');
  inputDisplays.inflationRate = document.getElementById('ret-inflationRate-display');
  inputDisplays.returnRate = document.getElementById('ret-returnRate-display');

  const displayMap = {
    currentAge: inputDisplays.currentAge,
    retireAge: inputDisplays.retireAge,
    monthlyExpenses: inputDisplays.monthlyExpenses,
    inflationRate: inputDisplays.inflationRate,
    returnRate: inputDisplays.returnRate
  };

  sliderDefs.forEach(def => {
    sliders[def.key] = createSlider({
      id: `ret-${def.key}`,
      min: def.min, max: def.max, step: def.step, value: inputs[def.key],
      formatter: def.formatter,
      onChange: (v) => {
        if (displayMap[def.key]) displayMap[def.key].value = v;
        updateAll();
      }
    });
    document.getElementById(def.id).appendChild(sliders[def.key].element);
  });

  inputDisplays.lifeExpectancy.addEventListener('change', updateAll);

  Object.entries(displayMap).forEach(([key, el]) => {
    el.addEventListener('change', () => {
      let v = parseFloat(el.value.replace(/,/g, ''));
      if (isNaN(v)) v = inputs[key];
      el.value = v;
      if (sliders[key]) sliders[key].setValue(v);
      updateAll();
    });
  });

  document.getElementById('ret-copy').addEventListener('click', () => {
    const vals = getInputs();
    const r = calculate(vals);
    copyResults({
      'Calculator': 'Retirement Planner',
      'Current Age': `${vals.currentAge}`,
      'Retirement Age': `${vals.retireAge}`,
      'Monthly Expenses': formatINRFull(vals.monthlyExpenses),
      'Inflation Rate': formatPercent(vals.inflationRate),
      'Expected Return': formatPercent(vals.returnRate),
      'Corpus Required': formatINRFull(r.corpus),
      'Monthly SIP Needed': formatINRFull(r.monthlySIP)
    });
  });

  document.getElementById('ret-reset').addEventListener('click', () => {
    Object.assign(inputs, defaultInputs);
    Object.keys(defaultInputs).forEach(k => {
      if (sliders[k]) sliders[k].reset(defaultInputs[k]);
      if (displayMap[k]) displayMap[k].value = defaultInputs[k];
    });
    inputDisplays.lifeExpectancy.value = defaultInputs.lifeExpectancy;
    updateAll();
    showToast('Reset to defaults');
  });

  const rc = getChartColors();
  createChart('ret-chart', 'line', {
    labels: ['Start', 'End'],
    datasets: [{ label: 'Corpus', data: [0, 0], borderColor: rc.chart2, fill: true, backgroundColor: rc.chart1 }]
  });
  updateAll();

  return {
    id: 'retirement',
    destroy: () => { destroyChart('ret-chart'); },
    refresh: () => updateAll()
  };
}
