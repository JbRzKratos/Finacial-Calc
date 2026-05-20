export type CalculatorInputs = Record<string, unknown>;
export type CalculatorResult = Record<string, unknown>;

export type CalculatorId = "sip" | "emi" | "fd" | "cagr" | "retirement" | "tax" | "loanvsinvest";

export interface CalculatorInfo {
  id: CalculatorId;
  label: string;
  icon: string;
}

export interface SliderConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  tickLabels?: string[];
}

export interface ChartConfig {
  type: "doughnut" | "bar" | "line";
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
}
