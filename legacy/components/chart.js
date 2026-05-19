import {
  Chart,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

Chart.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.plugins.legend.labels.usePointStyle = true;

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getThemeColors() {
  return {
    accent: getCSSVar('--accent') || 'oklch(0.922 0 0)',
    positive: getCSSVar('--positive') || 'oklch(0.87 0 0)',
    negative: getCSSVar('--negative') || 'oklch(0.704 0.191 22.216)',
    textMuted: getCSSVar('--text-muted') || 'oklch(0.708 0 0)',
    textPrimary: getCSSVar('--text-primary') || 'oklch(0.985 0 0)',
    border: getCSSVar('--border') || 'oklch(1 0 0 / 10%)',
    bgBase: getCSSVar('--bg-base') || 'oklch(0.145 0 0)',
    chart1: getCSSVar('--chart-1') || 'oklch(0.87 0 0)',
    chart2: getCSSVar('--chart-2') || 'oklch(0.556 0 0)',
    chart3: getCSSVar('--chart-3') || 'oklch(0.439 0 0)',
    chart4: getCSSVar('--chart-4') || 'oklch(0.371 0 0)',
    chart5: getCSSVar('--chart-5') || 'oklch(0.269 0 0)'
  };
}

export function getChartColors() {
  return getThemeColors();
}

let instances = {};

export function createChart(canvasId, type, data, opts = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  destroyChart(canvasId);

  const colors = getThemeColors();
  const ctx = canvas.getContext('2d');

  const defaultOpts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        labels: {
          color: colors.textMuted,
          boxWidth: 10,
          boxHeight: 10,
          padding: 12,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: colors.bgBase,
        titleColor: colors.textPrimary,
        bodyColor: colors.textPrimary,
        borderColor: colors.border,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 11 }
      }
    },
    scales: {}
  };

  if (type === 'doughnut') {
    defaultOpts.cutout = '65%';
  }

  if (type === 'bar' || type === 'line') {
    defaultOpts.scales.x = {
      grid: { color: colors.border, drawBorder: false },
      ticks: { color: colors.textMuted, font: { size: 10 } }
    };
    defaultOpts.scales.y = {
      grid: { color: colors.border, drawBorder: false },
      ticks: { color: colors.textMuted, font: { size: 10 } }
    };
  }

  if (type === 'line') {
    defaultOpts.elements = {
      line: { tension: 0.35, borderWidth: 2 },
      point: { radius: 3, hitRadius: 6 }
    };
    defaultOpts.fill = false;
  }

  const mergedOpts = deepMerge(defaultOpts, opts);

  const chart = new Chart(ctx, {
    type,
    data,
    options: mergedOpts
  });

  instances[canvasId] = chart;
  return chart;
}

export function updateChart(canvasId, data, opts = {}) {
  const chart = instances[canvasId];
  if (!chart) {
    return createChart(canvasId, data.type, data, opts);
  }

  const colors = getThemeColors();
  chart.data = data;

  if (chart.options.plugins?.legend?.labels) {
    chart.options.plugins.legend.labels.color = colors.textMuted;
  }
  if (chart.options.plugins?.tooltip) {
    chart.options.plugins.tooltip.backgroundColor = colors.bgBase;
    chart.options.plugins.tooltip.titleColor = colors.textPrimary;
    chart.options.plugins.tooltip.bodyColor = colors.textPrimary;
    chart.options.plugins.tooltip.borderColor = colors.border;
  }
  if (chart.options.scales?.x?.grid) {
    chart.options.scales.x.grid.color = colors.border;
  }
  if (chart.options.scales?.x?.ticks) {
    chart.options.scales.x.ticks.color = colors.textMuted;
  }
  if (chart.options.scales?.y?.grid) {
    chart.options.scales.y.grid.color = colors.border;
  }
  if (chart.options.scales?.y?.ticks) {
    chart.options.scales.y.ticks.color = colors.textMuted;
  }

  chart.update();
  return chart;
}

export function destroyChart(canvasId) {
  if (instances[canvasId]) {
    instances[canvasId].destroy();
    delete instances[canvasId];
  }
}

export function destroyAllCharts() {
  Object.keys(instances).forEach(key => destroyChart(key));
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key]) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
