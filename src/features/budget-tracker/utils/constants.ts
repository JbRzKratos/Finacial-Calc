import type { Category, Transaction } from "../types/budget";

export const STORAGE_KEY = "finance_transactions";

export const expenseCategories: Category[] = [
  { id: "food", label: "Food & Dining", icon: "🍽️", color: "#ef4444" },
  { id: "transport", label: "Transport", icon: "🚗", color: "#f97316" },
  { id: "shopping", label: "Shopping", icon: "🛍️", color: "#8b5cf6" },
  { id: "bills", label: "Bills & Utilities", icon: "📄", color: "#eab308" },
  { id: "rent", label: "Rent & Housing", icon: "🏠", color: "#3b82f6" },
  { id: "health", label: "Health", icon: "💊", color: "#22c55e" },
  { id: "entertainment", label: "Entertainment", icon: "🎬", color: "#ec4899" },
  { id: "education", label: "Education", icon: "📚", color: "#6366f1" },
  { id: "travel", label: "Travel", icon: "✈️", color: "#14b8a6" },
  { id: "groceries", label: "Groceries", icon: "🛒", color: "#a855f7" },
  { id: "insurance", label: "Insurance", icon: "🛡️", color: "#0ea5e9" },
  { id: "other-expense", label: "Other", icon: "📌", color: "#78716c" },
];

export const incomeCategories: Category[] = [
  { id: "salary", label: "Salary", icon: "💼", color: "#22c55e" },
  { id: "freelance", label: "Freelance", icon: "💻", color: "#3b82f6" },
  { id: "investments", label: "Investments", icon: "📈", color: "#8b5cf6" },
  { id: "gift", label: "Gift", icon: "🎁", color: "#ec4899" },
  { id: "refund", label: "Refund", icon: "💰", color: "#14b8a6" },
  { id: "other-income", label: "Other", icon: "📌", color: "#78716c" },
];

export function allCategories(type: "expense" | "income"): Category[] {
  return type === "expense" ? expenseCategories : incomeCategories;
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "expense",
    amount: 45000,
    category: "rent",
    date: "2026-05-01",
    note: "Monthly rent payment",
  },
  {
    id: "2",
    type: "expense",
    amount: 3200,
    category: "groceries",
    date: "2026-05-03",
    note: "Weekly groceries",
  },
  {
    id: "3",
    type: "income",
    amount: 120000,
    category: "salary",
    date: "2026-05-01",
    note: "May salary credit",
  },
  {
    id: "4",
    type: "expense",
    amount: 1500,
    category: "transport",
    date: "2026-05-04",
    note: "Fuel & metro recharge",
  },
  {
    id: "5",
    type: "expense",
    amount: 2500,
    category: "entertainment",
    date: "2026-05-05",
    note: "Movie night with friends",
  },
  {
    id: "6",
    type: "income",
    amount: 15000,
    category: "freelance",
    date: "2026-05-06",
    note: "Freelance project payment",
  },
  {
    id: "7",
    type: "expense",
    amount: 800,
    category: "food",
    date: "2026-05-06",
    note: "Lunch outing",
  },
  {
    id: "8",
    type: "expense",
    amount: 6000,
    category: "shopping",
    date: "2026-05-07",
    note: "New clothes",
  },
];
