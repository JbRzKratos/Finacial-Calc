export function initKeyboard(map) {
  const handler = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const action = map[e.code];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  document.addEventListener('keydown', handler);

  return function destroy() {
    document.removeEventListener('keydown', handler);
  };
}
