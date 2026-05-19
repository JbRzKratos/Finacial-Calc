const NAV_ICONS = {
  sip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  emi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="16" y1="11" x2="16" y2="14"/></svg>',
  fd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  cagr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="20" x2="21" y2="4"/><polyline points="15 4 21 4 21 10"/></svg>',
  retirement: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
  taxSaver: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  loanVsInvest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="20" x2="22" y2="20"/><polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/></svg>'
};

const SUN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

const MOON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

const LOGO_SVG = '<svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="currentColor" opacity="0.15"/><text x="16" y="23" font-family="Inter, sans-serif" font-size="20" font-weight="700" fill="currentColor" text-anchor="middle">C</text></svg>';

export function renderSidebar(container, calculators, activeId, onNavigate, currentTheme, onThemeToggle) {
  container.innerHTML = '';

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  sidebar.innerHTML = `
    <div class="sidebar-logo">
      ${LOGO_SVG}
      <div>
        <h1>FinCalc Pro</h1>
        <span>Financial Suite</span>
      </div>
    </div>
    <nav class="sidebar-nav" role="tablist">
      ${calculators.map((c, i) => `
        <button class="nav-item ${c.id === activeId ? 'active' : ''}"
                data-calc="${c.id}"
                role="tab"
                aria-selected="${c.id === activeId}"
                tabindex="${c.id === activeId ? 0 : -1}">
          <span class="nav-icon">${NAV_ICONS[c.id] || ''}</span>
          <span>${c.label}</span>
          <span class="nav-key">${i + 1}</span>
        </button>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      <button class="theme-toggle-btn" id="themeToggle" title="Toggle theme (T)">
        <span class="theme-icon">${currentTheme === 'dark' ? SUN_ICON : MOON_ICON}</span>
        <span>${currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>
  `;

  container.appendChild(sidebar);

  sidebar.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => {
      const calcId = el.dataset.calc;
      onNavigate(calcId);
    });
  });

  sidebar.querySelector('#themeToggle').addEventListener('click', onThemeToggle);
}

export function updateSidebarActive(container, activeId) {
  container.querySelectorAll('.nav-item').forEach(el => {
    const isActive = el.dataset.calc === activeId;
    el.classList.toggle('active', isActive);
    el.setAttribute('aria-selected', isActive);
    el.tabIndex = isActive ? 0 : -1;
  });
}

export function updateThemeIcon(container, theme) {
  const btn = container.querySelector('#themeToggle');
  if (!btn) return;
  const icon = btn.querySelector('.theme-icon');
  const label = btn.querySelector('span:last-child');
  if (theme === 'dark') {
    icon.innerHTML = SUN_ICON;
    label.textContent = 'Light Mode';
  } else {
    icon.innerHTML = MOON_ICON;
    label.textContent = 'Dark Mode';
  }
}

const TAB_ICONS = {
  sip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  emi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="16" y1="11" x2="16" y2="14"/></svg>',
  fd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  cagr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="20" x2="21" y2="4"/><polyline points="15 4 21 4 21 10"/></svg>',
  retirement: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
  taxSaver: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  loanVsInvest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="20" x2="22" y2="20"/><polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/></svg>'
};

export function renderMobileTabbar(container, calculators, activeId, onNavigate) {
  container.innerHTML = '';
  const bar = document.createElement('div');
  bar.className = 'mobile-tabbar';

  calculators.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = `tabbar-item ${c.id === activeId ? 'active' : ''}`;
    btn.dataset.calc = c.id;
    btn.innerHTML = `${TAB_ICONS[c.id] || ''}<span>${c.shortLabel || c.label.split(' ')[0]}</span>`;
    btn.addEventListener('click', () => onNavigate(c.id));
    bar.appendChild(btn);
  });

  container.appendChild(bar);
}

export function updateMobileTabbarActive(container, activeId) {
  container.querySelectorAll('.tabbar-item').forEach(el => {
    el.classList.toggle('active', el.dataset.calc === activeId);
  });
}
