export function createSlider(config) {
  const {
    id, min = 0, max = 100, step = 1, value = min,
    formatter = (v) => String(v),
    onChange = () => {}
  } = config;

  const container = document.createElement('div');
  container.className = 'slider-container';
  container.id = id;

  container.innerHTML = `
    <div class="slider-track">
      <div class="slider-fill"></div>
      <div class="slider-thumb"></div>
      <div class="slider-tooltip">${formatter(value)}</div>
    </div>
    <div class="slider-labels">
      <span>${formatter(min)}</span>
      <span>${formatter(max)}</span>
    </div>
    <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${id}" />
  `;

  const input = container.querySelector('input');
  const fill = container.querySelector('.slider-fill');
  const thumb = container.querySelector('.slider-thumb');
  const tooltip = container.querySelector('.slider-tooltip');

  let rafId = null;
  let currentValue = value;

  function updateSlider(val, fireOnChange = true) {
    const v = parseFloat(val);
    currentValue = v;

    const pct = ((v - min) / (max - min)) * 100;
    fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    thumb.style.left = `${Math.max(0, Math.min(100, pct))}%`;
    tooltip.textContent = formatter(v);

    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    if (fireOnChange) {
      rafId = requestAnimationFrame(() => {
        onChange(v);
        rafId = null;
      });
    }
  }

  input.addEventListener('input', (e) => {
    updateSlider(e.target.value, true);
    container.classList.add('dragging');
  });

  input.addEventListener('change', (e) => {
    container.classList.remove('dragging');
    updateSlider(e.target.value, true);
  });

  input.addEventListener('blur', () => {
    container.classList.remove('dragging');
  });

  updateSlider(value, false);

  return {
    element: container,
    getValue: () => currentValue,
    setValue: (v) => {
      input.value = v;
      updateSlider(v, false);
    },
    reset: (v) => {
      input.value = v;
      updateSlider(v, false);
    }
  };
}
