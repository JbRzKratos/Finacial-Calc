"use client";

const STORAGE_KEY = "fincalc_budget_data";

interface StoredData {
  categories: import("@/types").BudgetCategory[];
  transactions: Record<string, import("@/types").Transaction[]>;
  totalBudgetOverride: number | null;
}

function emptyData(): StoredData {
  return { categories: [], transactions: {}, totalBudgetOverride: null };
}

let cached: StoredData | null = null;
let writeTimer: ReturnType<typeof setTimeout> | null = null;

function ensureData(): StoredData {
  if (cached === null) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: StoredData | null = raw ? JSON.parse(raw) : null;
      cached = parsed ?? emptyData();
      if (!cached.categories) cached.categories = [];
      if (!cached.transactions) cached.transactions = {};
    } catch {
      cached = emptyData();
    }
  }
  return cached;
}

function scheduleWrite() {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try {
      if (cached) localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
    } catch {}
    writeTimer = null;
  }, 300);
}

export function getCategories() {
  return ensureData().categories;
}

export function saveCategories(cats: import("@/types").BudgetCategory[]) {
  ensureData().categories = cats;
  scheduleWrite();
}

function monthKey(month: number, year: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function getTransactions(
  month: number,
  year: number
): import("@/types").Transaction[] {
  return ensureData().transactions[monthKey(month, year)] || [];
}

export function getTransactionsForRange(
  fromMonth: number,
  fromYear: number,
  toMonth: number,
  toYear: number
): import("@/types").Transaction[] {
  const all: import("@/types").Transaction[] = [];
  let m = fromMonth, y = fromYear;
  while (true) {
    const txns = ensureData().transactions[monthKey(m, y)] || [];
    all.push(...txns);
    if (m === toMonth && y === toYear) break;
    m++;
    if (m > 11) { m = 0; y++; }
  }
  all.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  return all;
}

export function saveTransactions(
  month: number,
  year: number,
  txns: import("@/types").Transaction[]
) {
  ensureData().transactions[monthKey(month, year)] = txns;
  scheduleWrite();
}

export function addTransaction(
  month: number,
  year: number,
  txn: import("@/types").Transaction
) {
  const key = monthKey(month, year);
  if (!ensureData().transactions[key]) ensureData().transactions[key] = [];
  ensureData().transactions[key].push(txn);
  scheduleWrite();
}

export function deleteTransaction(
  month: number,
  year: number,
  id: string
) {
  const key = monthKey(month, year);
  if (ensureData().transactions[key]) {
    ensureData().transactions[key] = ensureData().transactions[key].filter((t) => t.id !== id);
  }
  scheduleWrite();
}

export function deleteCategoryTransactions(
  month: number,
  year: number,
  catId: string
) {
  const key = monthKey(month, year);
  if (ensureData().transactions[key]) {
    ensureData().transactions[key] = ensureData().transactions[key].filter(
      (t) => t.categoryId !== catId
    );
  }
  scheduleWrite();
}

export function getTotalBudgetOverride(): number | undefined {
  return ensureData().totalBudgetOverride ?? undefined;
}

export function setTotalBudgetOverride(val: number | undefined) {
  ensureData().totalBudgetOverride = val ?? null;
  scheduleWrite();
}

export function updateCategoryLimit(catId: string, newLimit: number) {
  const cat = ensureData().categories.find((c) => c.id === catId);
  if (cat) {
    cat.monthlyLimit = newLimit;
    scheduleWrite();
  }
}
