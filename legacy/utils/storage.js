const PREFIX = 'calchub_';

export function saveState(calculatorId, data) {
  try {
    const key = PREFIX + calculatorId;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
  }
}

export function loadState(calculatorId) {
  try {
    const key = PREFIX + calculatorId;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
  }
  return null;
}

export function clearState(calculatorId) {
  try {
    const key = PREFIX + calculatorId;
    localStorage.removeItem(key);
  } catch (e) {
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(PREFIX + 'theme', theme);
  } catch (e) {
  }
}

export function loadTheme() {
  try {
    return localStorage.getItem(PREFIX + 'theme') || 'dark';
  } catch (e) {
    return 'dark';
  }
}
