import type { BudgetCategory, Transaction, BudgetSummary, CategoryBreakdown, DateRange } from "./budgetTypes";

function getStatus(percent: number): "safe" | "warning" | "over" {
  if (percent >= 100) return "over";
  if (percent >= 75) return "warning";
  return "safe";
}

function filterByDateRange(txns: Transaction[], range: DateRange): Transaction[] {
  return txns.filter((t) => t.date >= range.startDate && t.date <= range.endDate);
}

export function getMonthDateRange(month: number, year: number): DateRange {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { startDate, endDate };
}

export function computeBudgetSummary(
  categories: BudgetCategory[],
  transactions: Transaction[],
  dateRange?: DateRange
): BudgetSummary {
  const range = dateRange ?? getMonthDateRange(new Date().getMonth(), new Date().getFullYear());
  const filtered = dateRange ? filterByDateRange(transactions, range) : transactions;

  const totalLimit = categories.reduce((s, c) => s + c.monthlyLimit, 0);
  const totalSpent = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const percentSpent = totalLimit > 0 ? Math.min(100, (totalSpent / totalLimit) * 100) : 0;
  const daysLeft = computeDaysLeftInRange(range);

  const categoryBreakdown: CategoryBreakdown[] = categories.map((cat) => {
    const spent = filtered.filter((t) => t.categoryId === cat.id && t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const remaining = Math.max(0, cat.monthlyLimit - spent);
    const pct = cat.monthlyLimit > 0 ? Math.min(100, (spent / cat.monthlyLimit) * 100) : 0;
    return { category: cat, spent, remaining, percentSpent: pct, status: getStatus(pct) };
  });

  return { totalLimit, totalSpent, totalRemaining, percentSpent, daysLeft, dateRange: range, categoryBreakdown };
}

export function computeDaysLeftInRange(range: DateRange): number {
  const now = new Date();
  const end = new Date(range.endDate + "T23:59:59");
  const diff = Math.ceil((end.getTime() - now.getTime()) / 86400000);
  return Math.max(0, diff);
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

export function formatDateRange(range: DateRange): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  const s = new Date(range.startDate + "T00:00:00");
  const e = new Date(range.endDate + "T00:00:00");
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${e.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("en-IN", opts)} - ${e.toLocaleDateString("en-IN", opts)}`;
}
