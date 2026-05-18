import { CalculatorInputs } from "@/types/calculator";

const PREFIX = "fincalc_";

export function saveState(calculatorId: string, data: CalculatorInputs): void {
  try {
    localStorage.setItem(PREFIX + calculatorId, JSON.stringify(data));
  } catch {
  }
}

export function loadState(calculatorId: string): CalculatorInputs | null {
  try {
    const raw = localStorage.getItem(PREFIX + calculatorId);
    if (raw) return JSON.parse(raw) as CalculatorInputs;
  } catch {
  }
  return null;
}

export function clearState(calculatorId: string): void {
  try {
    localStorage.removeItem(PREFIX + calculatorId);
  } catch {
  }
}

export function saveTheme(theme: string): void {
  try {
    localStorage.setItem(PREFIX + "theme", theme);
  } catch {
  }
}

export function loadTheme(): string {
  try {
    return localStorage.getItem(PREFIX + "theme") || "dark";
  } catch {
    return "dark";
  }
}
