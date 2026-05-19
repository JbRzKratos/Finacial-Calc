import type { BudgetCategory, Transaction } from "./budgetTypes";

const STORAGE_KEY = "fincalc_budget_data";

interface StoredData {
  categories: BudgetCategory[];
  transactions: Record<string, Transaction[]>; // key: "YYYY-MM"
  totalBudgetOverride?: number; // optional total budget cap, categories scale proportionally
}

function getFromStorage(): StoredData {
  if (typeof window === "undefined") return { categories: [], transactions: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredData;
  } catch {}
  return { categories: [], transactions: {} };
}

function setToStorage(data: StoredData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { console.warn("Storage failed"); }
}

function monthKey(month: number, year: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function getCategories(): BudgetCategory[] {
  return getFromStorage().categories;
}

export function saveCategories(cats: BudgetCategory[]): void {
  const data = getFromStorage();
  data.categories = cats;
  setToStorage(data);
}

export function getTransactions(month: number, year: number): Transaction[] {
  return getFromStorage().transactions[monthKey(month, year)] || [];
}

export function saveTransactions(month: number, year: number, txns: Transaction[]): void {
  const data = getFromStorage();
  data.transactions[monthKey(month, year)] = txns;
  setToStorage(data);
}

export function addTransaction(month: number, year: number, txn: Transaction): void {
  const key = monthKey(month, year);
  const data = getFromStorage();
  if (!data.transactions[key]) data.transactions[key] = [];
  data.transactions[key].push(txn);
  setToStorage(data);
}

export function deleteTransaction(month: number, year: number, txnId: string): void {
  const key = monthKey(month, year);
  const data = getFromStorage();
  if (data.transactions[key]) {
    data.transactions[key] = data.transactions[key].filter((t) => t.id !== txnId);
    setToStorage(data);
  }
}

export function deleteCategoryTransactions(month: number, year: number, categoryId: string): void {
  const key = monthKey(month, year);
  const data = getFromStorage();
  if (data.transactions[key]) {
    data.transactions[key] = data.transactions[key].filter((t) => t.categoryId !== categoryId);
    setToStorage(data);
  }
}

export function getTotalBudgetOverride(): number | undefined {
  return getFromStorage().totalBudgetOverride;
}

export function setTotalBudgetOverride(value: number | undefined): void {
  const data = getFromStorage();
  data.totalBudgetOverride = value;
  setToStorage(data);
}

export function updateCategoryLimit(categoryId: string, newLimit: number): void {
  const data = getFromStorage();
  const idx = data.categories.findIndex((c) => c.id === categoryId);
  if (idx !== -1) {
    data.categories[idx] = { ...data.categories[idx], monthlyLimit: newLimit };
    setToStorage(data);
  }
}
