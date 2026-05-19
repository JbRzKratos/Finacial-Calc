import type { BudgetCategory, Transaction } from "./budgetTypes";

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("Storage failed:", key);
  }
}

const CATEGORIES_KEY = "fincalc_budget_categories";
const TRANSACTIONS_PREFIX = "fincalc_budget_transactions_";

export function getCategories(): BudgetCategory[] {
  return getFromStorage<BudgetCategory[]>(CATEGORIES_KEY, []);
}

export function saveCategories(cats: BudgetCategory[]): void {
  setToStorage(CATEGORIES_KEY, cats);
}

function transactionsKey(month: number, year: number): string {
  return `${TRANSACTIONS_PREFIX}${year}_${String(month + 1).padStart(2, "0")}`;
}

export function getTransactions(month: number, year: number): Transaction[] {
  return getFromStorage<Transaction[]>(transactionsKey(month, year), []);
}

export function saveTransactions(month: number, year: number, txns: Transaction[]): void {
  setToStorage(transactionsKey(month, year), txns);
}

export function addTransaction(month: number, year: number, txn: Transaction): void {
  const txns = getTransactions(month, year);
  txns.push(txn);
  saveTransactions(month, year, txns);
}

export function deleteTransaction(month: number, year: number, txnId: string): void {
  const txns = getTransactions(month, year);
  saveTransactions(month, year, txns.filter((t) => t.id !== txnId));
}

export function deleteCategoryTransactions(month: number, year: number, categoryId: string): void {
  const txns = getTransactions(month, year);
  saveTransactions(month, year, txns.filter((t) => t.categoryId !== categoryId));
}
