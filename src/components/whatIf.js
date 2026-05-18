export function createWhatIfToggle(onToggle, initialState = false) {
  const container = document.createElement('div');
  container.className = 'whatif-toggle-area';

  const toggle = document.createElement('div');
  toggle.className = `toggle-switch ${initialState ? 'active' : ''}`;
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('aria-checked', initialState);
  toggle.setAttribute('tabindex', '0');

  toggle.innerHTML = '<div class="toggle-knob"></div>';

  const label = document.createElement('span');
  label.style.cssText = 'font-size:0.8rem;font-weight:500;color:var(--text-muted);cursor:pointer;user-select:none';
  label.textContent = 'What-If Mode';

  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.toggle('active');
    toggle.setAttribute('aria-checked', isActive);
    onToggle(isActive);
  });

  label.addEventListener('click', () => toggle.click());

  container.appendChild(toggle);
  container.appendChild(label);

  return {
    element: container,
    setState: (active) => {
      toggle.classList.toggle('active', active);
      toggle.setAttribute('aria-checked', active);
    },
    isActive: () => toggle.classList.contains('active')
  };
}

export function createWhatIfPanel(containerId, label, badgeClass) {
  const panel = document.createElement('div');
  panel.className = 'whatif-panel';

  panel.innerHTML = `
    <span class="whatif-badge ${badgeClass}">${label}</span>
    <div id="${containerId}" class="whatif-content"></div>
  `;

  return panel;
}

export function renderWhatIfView(mainContainer, liveContent, pinnedContent, calculatorId) {
  mainContainer.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'whatif-container';

  const livePanel = document.createElement('div');
  livePanel.className = 'whatif-panel';
  livePanel.innerHTML = `<span class="whatif-badge live">● Live</span>`;
  livePanel.appendChild(liveContent);

  const pinnedPanel = document.createElement('div');
  pinnedPanel.className = 'whatif-panel';
  pinnedPanel.innerHTML = `<span class="whatif-badge pinned">📌 Pinned</span>`;

  const pinnedInner = pinnedContent.cloneNode(true);
  pinnedPanel.appendChild(pinnedInner);

  grid.appendChild(livePanel);
  grid.appendChild(pinnedPanel);
  mainContainer.appendChild(grid);

  return {
    updateLive: (newContent) => {
      const existingLive = grid.querySelector('.whatif-panel:first-child');
      if (existingLive) {
        const label = existingLive.querySelector('.whatif-badge');
        existingLive.innerHTML = '';
        existingLive.appendChild(label);
        existingLive.appendChild(newContent);
      }
    }
  };
}

export function snapshotResults(container) {
  const clone = container.cloneNode(true);
  clone.querySelectorAll('input, select, textarea, .slider-container').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
      el.disabled = true;
    } else {
      el.style.pointerEvents = 'none';
      el.style.opacity = '0.7';
    }
  });
  clone.querySelectorAll('.nav-item, button').forEach(b => b.disabled = true);
  return clone;
}
