import type { BudgetCategory, Transaction } from "./budgetTypes";

const STORAGE_KEY = "fincalc_budget_data";

interface StoredData {
  categories: BudgetCategory[];
  transactions: Record<string, Transaction[]>; // key: "YYYY-MM"
  totalBudgetOverride?: number;
}

function getDefaultData(): StoredData {
  return { categories: [], transactions: {} };
}

// In-memory cache — read once at init
let appData: StoredData | null = null;

function ensureLoaded(): StoredData {
  if (appData) return appData;
  if (typeof window === "undefined") {
    appData = getDefaultData();
    return appData;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    appData = raw ? (JSON.parse(raw) as StoredData) : getDefaultData();
  } catch {
    appData = getDefaultData();
  }
  return appData;
}

// Debounced write to localStorage
let writeTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleWrite(): void {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    if (appData && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
      } catch {
        // Storage quota exceeded — fail silently
      }
    }
    writeTimer = null;
  }, 300);
}

function monthKey(month: number, year: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function getCategories(): BudgetCategory[] {
  return ensureLoaded().categories;
}

export function saveCategories(cats: BudgetCategory[]): void {
  const data = ensureLoaded();
  data.categories = cats;
  scheduleWrite();
}

export function getTransactions(month: number, year: number): Transaction[] {
  return ensureLoaded().transactions[monthKey(month, year)] || [];
}

export function getTransactionsForRange(fromMonth: number, fromYear: number, toMonth: number, toYear: number): Transaction[] {
  const all: Transaction[] = [];
  const data = ensureLoaded();
  let m = fromMonth, y = fromYear;
  while (true) {
    const key = monthKey(m, y);
    if (data.transactions[key]) all.push(...data.transactions[key]);
    if (m === toMonth && y === toYear) break;
    m++;
    if (m > 11) { m = 0; y++; }
  }
  return all;
}

export function saveTransactions(month: number, year: number, txns: Transaction[]): void {
  const data = ensureLoaded();
  data.transactions[monthKey(month, year)] = txns;
  scheduleWrite();
}

export function addTransaction(month: number, year: number, txn: Transaction): void {
  const key = monthKey(month, year);
  const data = ensureLoaded();
  if (!data.transactions[key]) data.transactions[key] = [];
  data.transactions[key].push(txn);
  scheduleWrite();
}

export function deleteTransaction(month: number, year: number, txnId: string): void {
  const key = monthKey(month, year);
  const data = ensureLoaded();
  if (data.transactions[key]) {
    data.transactions[key] = data.transactions[key].filter((t) => t.id !== txnId);
    scheduleWrite();
  }
}

export function deleteCategoryTransactions(month: number, year: number, categoryId: string): void {
  const key = monthKey(month, year);
  const data = ensureLoaded();
  if (data.transactions[key]) {
    data.transactions[key] = data.transactions[key].filter((t) => t.categoryId !== categoryId);
    scheduleWrite();
  }
}

export function getTotalBudgetOverride(): number | undefined {
  return ensureLoaded().totalBudgetOverride;
}

export function setTotalBudgetOverride(value: number | undefined): void {
  const data = ensureLoaded();
  data.totalBudgetOverride = value;
  scheduleWrite();
}

export function updateCategoryLimit(categoryId: string, newLimit: number): void {
  const data = ensureLoaded();
  const idx = data.categories.findIndex((c) => c.id === categoryId);
  if (idx !== -1) {
    data.categories[idx] = { ...data.categories[idx], monthlyLimit: newLimit };
    scheduleWrite();
  }
}
