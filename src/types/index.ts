export type CalculatorInputs = Record<string, unknown>;
export type CalculatorResult = Record<string, unknown>;

export type CalculatorId = "sip" | "emi" | "fd" | "cagr" | "retirement" | "tax" | "loanvsinvest";

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  monthlyLimit: number;
  color: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  note: string;
  date: string;
  type: "expense" | "income";
}

export interface CategoryBreakdown {
  category: BudgetCategory;
  spent: number;
  remaining: number;
  percentSpent: number;
  status: "safe" | "warning" | "over";
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface BudgetSummary {
  totalLimit: number;
  totalSpent: number;
  totalRemaining: number;
  percentSpent: number;
  daysLeft: number;
  dateRange: DateRange;
  categoryBreakdown: CategoryBreakdown[];
}
