export function createProgressRing(container, current, target) {
  container.innerHTML = '';

  const size = 100;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(Math.max(current / target, 0), 1) : 0;
  const offset = circumference * (1 - pct);

  const wrapper = document.createElement('div');
  wrapper.className = 'progress-ring-container';
  wrapper.style.width = `${size}px`;
  wrapper.style.height = `${size}px`;

  wrapper.innerHTML = `
    <svg class="progress-ring" width="${size}" height="${size}">
      <circle class="bg-circle" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}" />
      <circle class="fg-circle" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"
              style="--ring-circumference: ${circumference}" />
    </svg>
    <div class="progress-ring-label">
      <div class="pct">${(pct * 100).toFixed(0)}%</div>
      <div class="sub">of goal</div>
    </div>
  `;

  container.appendChild(wrapper);

  return {
    update: (newCurrent, newTarget) => {
      const newPct = newTarget > 0 ? Math.min(Math.max(newCurrent / newTarget, 0), 1) : 0;
      const newOffset = circumference * (1 - newPct);
      const circle = wrapper.querySelector('.fg-circle');
      const pctEl = wrapper.querySelector('.pct');
      if (circle) {
        circle.style.strokeDashoffset = newOffset;
      }
      if (pctEl) {
        pctEl.textContent = `${(newPct * 100).toFixed(0)}%`;
      }
    }
  };
}
