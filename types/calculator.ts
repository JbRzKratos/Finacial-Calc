export type CalculatorId =
  | "sip"
  | "emi"
  | "fd"
  | "cagr"
  | "retirement"
  | "tax"
  | "loanvsinvest";

export interface CalculatorInfo {
  id: CalculatorId;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  tags: string[];
}

export interface SliderConfig {
  label: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: "₹" | "%" | "yr" | "mo";
  unitPosition: "prefix" | "suffix";
  helperText: string;
}

export interface CalculatorInputs {
  [key: string]: number | string | boolean;
}

export interface CalculatorResult {
  [key: string]: number | string | { year: number; [key: string]: number }[];
}

export interface YearlyRow {
  year: number;
  [key: string]: number;
}

export interface ChartConfig {
  type: "line" | "doughnut" | "bar";
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderDash?: number[];
      fill?: boolean;
    }[];
  };
  options?: Record<string, unknown>;
}

export interface InsightData {
  icon: string;
  title: string;
  description: string;
}

export interface BreakdownData {
  headers: string[];
  rows: (string | number)[][];
}
