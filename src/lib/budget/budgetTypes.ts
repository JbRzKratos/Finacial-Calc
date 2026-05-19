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

export interface BudgetSummary {
  totalLimit: number;
  totalSpent: number;
  totalRemaining: number;
  percentSpent: number;
  daysLeftInMonth: number;
  categoryBreakdown: CategoryBreakdown[];
}
