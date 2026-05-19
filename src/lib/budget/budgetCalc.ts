import type { BudgetCategory, Transaction, BudgetSummary, CategoryBreakdown } from "./budgetTypes";

function getStatus(percent: number): "safe" | "warning" | "over" {
  if (percent >= 100) return "over";
  if (percent >= 75) return "warning";
  return "safe";
}

export function computeBudgetSummary(
  categories: BudgetCategory[],
  transactions: Transaction[]
): BudgetSummary {
  const totalLimit = categories.reduce((s, c) => s + c.monthlyLimit, 0);
  const totalSpent = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const percentSpent = totalLimit > 0 ? Math.min(100, (totalSpent / totalLimit) * 100) : 0;
  const daysLeftInMonth = computeDaysLeft();

  const categoryBreakdown: CategoryBreakdown[] = categories.map((cat) => {
    const spent = transactions.filter((t) => t.categoryId === cat.id && t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const remaining = Math.max(0, cat.monthlyLimit - spent);
    const percentSpent = cat.monthlyLimit > 0 ? Math.min(100, (spent / cat.monthlyLimit) * 100) : 0;
    return { category: cat, spent, remaining, percentSpent, status: getStatus(percentSpent) };
  });

  return { totalLimit, totalSpent, totalRemaining, percentSpent, daysLeftInMonth, categoryBreakdown };
}

export function computeDaysLeft(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.max(0, lastDay - now.getDate());
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatINRShort(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
}

export function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
