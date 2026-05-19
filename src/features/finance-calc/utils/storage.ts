import { CalculatorInputs } from "@/features/finance-calc/types/calculator";

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


