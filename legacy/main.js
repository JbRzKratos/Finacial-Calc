import '@fontsource/inter';
import './style/base.css';
import './style/theme.css';
import './style/layout.css';
import './style/components.css';
import './style/charts.css';
import './style/animations.css';

import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';

import { renderSidebar, updateSidebarActive, updateThemeIcon, renderMobileTabbar, updateMobileTabbarActive } from './components/sidebar.js';
import { initKeyboard } from './utils/keyboard.js';
import { saveTheme, loadTheme } from './utils/storage.js';
import { showToast } from './utils/clipboard.js';

SplashScreen.hide();

const CALCULATOR_REGISTRY = [
  { id: 'sip', label: 'SIP Calculator', module: () => import('./calculators/sip.js') },
  { id: 'emi', label: 'EMI Calculator', module: () => import('./calculators/emi.js') },
  { id: 'fd', label: 'FD / RD Calculator', module: () => import('./calculators/fd.js') },
  { id: 'cagr', label: 'CAGR Calculator', module: () => import('./calculators/cagr.js') },
  { id: 'retirement', label: 'Retirement Planner', module: () => import('./calculators/retirement.js') },
  { id: 'taxSaver', label: 'Tax Saver (80C)', module: () => import('./calculators/taxSaver.js') },
  { id: 'loanVsInvest', label: 'Loan vs Invest', module: () => import('./calculators/loanVsInvest.js') }
];

let currentCalculator = 'sip';
let currentInstance = null;
let currentTheme = 'dark';
let whatIfActive = false;
let whatIfSnapshot = null;

const app = document.getElementById('app');

function createAppShell() {
  app.innerHTML = '';

  const sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'sidebar-container';

  const mainPanel = document.createElement('div');
  mainPanel.className = 'main-panel';
  mainPanel.id = 'main-panel';

  const panelHeader = document.createElement('div');
  panelHeader.className = 'panel-header';
  panelHeader.id = 'panel-header';
  panelHeader.innerHTML = '<h2 id="calc-title">Loading...</h2><p id="calc-subtitle"></p>';

  const calcContainer = document.createElement('div');
  calcContainer.id = 'calc-container';

  mainPanel.appendChild(panelHeader);
  mainPanel.appendChild(calcContainer);
  app.appendChild(sidebarContainer);
  app.appendChild(mainPanel);

  const mobileTabbar = document.createElement('div');
  mobileTabbar.id = 'mobile-tabbar';
  app.appendChild(mobileTabbar);
}

function getCalculatorInfo(id) {
  return CALCULATOR_REGISTRY.find(c => c.id === id) || CALCULATOR_REGISTRY[0];
}

async function navigateTo(calcId) {
  if (calcId === currentCalculator && currentInstance) {
    return;
  }

  const info = getCalculatorInfo(calcId);
  if (!info) return;

  currentCalculator = calcId;

  if (currentInstance && currentInstance.destroy) {
    currentInstance.destroy();
    currentInstance = null;
  }

  const titleEl = document.getElementById('calc-title');
  const subtitleEl = document.getElementById('calc-subtitle');
  const calcContainer = document.getElementById('calc-container');

  calcContainer.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-muted)">Loading…</div>';

  try {
    const mod = await info.module();
    const labelMap = {
      sip: 'Plan your monthly investments and watch your wealth grow with the power of compounding.',
      emi: 'Know your monthly EMI, total interest, and full amortization schedule instantly.',
      fd: 'Calculate fixed deposit / recurring deposit maturity with different compounding frequencies.',
      cagr: 'Measure your investment\'s annualized growth rate over any period.',
      retirement: 'Plan your golden years — figure out the corpus you need and how to get there.',
      taxSaver: 'See how much tax you save by investing in 80C instruments.',
      loanVsInvest: 'Compare whether paying off a loan or investing the money works better for you.'
    };

    titleEl.textContent = mod.label || info.label;
    subtitleEl.textContent = labelMap[calcId] || '';

    calcContainer.innerHTML = '';
    currentInstance = mod.render(calcContainer, onCalcStateChange);

    updateSidebarActive(document.getElementById('sidebar-container'), calcId);
    updateMobileTabbarActive(document.getElementById('mobile-tabbar'), calcId);
  } catch (err) {
    console.error('Failed to load calculator:', err);
    calcContainer.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--negative)">Failed to load calculator. Please try again.</div>';
  }
}

function onCalcStateChange(result, inputs) {
}

function syncStatusBar(theme) {
  StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light });
  StatusBar.setBackgroundColor({
    color: theme === 'dark' ? '#0D0D14' : '#F4F4FB'
  });
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme();
  saveTheme(currentTheme);
  updateThemeIcon(document.getElementById('sidebar-container'), currentTheme);
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  syncStatusBar(currentTheme);
}

function toggleWhatIf() {
  whatIfActive = !whatIfActive;
  showToast(whatIfActive ? 'What-If Mode: ON' : 'What-If Mode: OFF');
}

function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h;
  const particles = [];
  const COUNT = 50;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.2 + 0.1),
        r: Math.random() * 2 + 1,
        o: Math.random() * 0.08 + 0.02
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const pColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      ctx.fillStyle = pColor.startsWith('oklch')
        ? pColor.replace(')', ` / ${p.o})`)
        : `rgba(128, 128, 128, ${p.o})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', resize);
}

function setupHaptics() {
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach(sl => {
    sl.addEventListener('input', () => {
      Haptics.impact({ style: ImpactStyle.Light });
    });
  });

  const navItems = document.querySelectorAll('.nav-item, .tabbar-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      Haptics.impact({ style: ImpactStyle.Medium });
    });
  });
}

function setupKeyboardListeners() {
  Keyboard.addListener('keyboardWillShow', info => {
    const panel = document.querySelector('.main-panel');
    if (panel) panel.style.paddingBottom = info.keyboardHeight + 'px';
  });
  Keyboard.addListener('keyboardWillHide', () => {
    const panel = document.querySelector('.main-panel');
    if (panel) panel.style.paddingBottom = '';
  });
}

function setupBackButton() {
  App.addListener('backButton', () => {
    if (whatIfActive) {
      toggleWhatIf();
    } else if (currentCalculator !== 'sip') {
      navigateTo('sip');
    } else {
      App.exitApp();
    }
  });
}

function init() {
  currentTheme = loadTheme();
  applyTheme();

  createAppShell();

  renderSidebar(
    document.getElementById('sidebar-container'),
    CALCULATOR_REGISTRY,
    currentCalculator,
    (id) => navigateTo(id),
    currentTheme,
    toggleTheme
  );

  renderMobileTabbar(
    document.getElementById('mobile-tabbar'),
    CALCULATOR_REGISTRY,
    currentCalculator,
    (id) => navigateTo(id)
  );

  initParticles();

  const keyboardMap = {};
  CALCULATOR_REGISTRY.forEach((c, i) => {
    keyboardMap[`Digit${i + 1}`] = () => navigateTo(c.id);
  });
  keyboardMap['KeyT'] = toggleTheme;
  keyboardMap['KeyW'] = toggleWhatIf;

  initKeyboard(keyboardMap);

  setupHaptics();
  setupKeyboardListeners();
  setupBackButton();

  navigateTo('sip');
}

document.addEventListener('DOMContentLoaded', init);
