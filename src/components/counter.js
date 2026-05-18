export function animateCounter(el, from, to, duration = 800, formatter = null) {
  if (!el) return;

  if (el._counterRaf) {
    cancelAnimationFrame(el._counterRaf);
  }

  const startTime = performance.now();
  const diff = to - from;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOut(progress);
    const currentValue = from + diff * easedProgress;

    if (formatter) {
      el.textContent = formatter(currentValue);
    } else {
      el.textContent = Math.round(currentValue).toString();
    }

    if (progress < 1) {
      el._counterRaf = requestAnimationFrame(step);
    } else {
      if (formatter) {
        el.textContent = formatter(to);
      } else {
        el.textContent = Math.round(to).toString();
      }
      el._counterRaf = null;
    }
  }

  el._counterRaf = requestAnimationFrame(step);
}

export function animateCountersInElement(container, data, formatter = null) {
  const els = container.querySelectorAll('[data-counter]');
  els.forEach(el => {
    const key = el.dataset.counter;
    const to = data[key];
    if (to !== undefined && to !== null) {
      const from = el.dataset.counterFrom !== undefined ? parseFloat(el.dataset.counterFrom) : 0;
      animateCounter(el, from, to, 800, formatter);
    }
  });
}
