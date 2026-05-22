
import { useState, useEffect, useCallback, useMemo } from "react";
import type { BudgetCategory, Transaction, BudgetSummary, DateRange } from "@/types";
import { getCategories, saveCategories, getTransactions, getTransactionsForRange, saveTransactions, addTransaction as storeAddTxn, deleteTransaction as storeDeleteTxn, deleteCategoryTransactions as storeDeleteCatTxns, updateCategory as storeUpdateCategory } from "@/store";
import { computeBudgetSummary, generateId, getMonthDateRange } from "@/utils/calculations";

const SEED_CATS: BudgetCategory[] = [
  { id: "cat_food", name: "Food", icon: "fork-knife", iconBg: "#FF6B00", monthlyLimit: 8000, color: "#FF6B00", createdAt: "2025-01-01", subCategories: ["Restaurants", "Cafes", "Delivery"] },
  { id: "cat_groceries", name: "Groceries", icon: "shopping-cart", iconBg: "#14B8A6", monthlyLimit: 5000, color: "#14B8A6", createdAt: "2025-01-01", subCategories: ["Supermarket", "Fruits & Veggies", "Dairy"] },
  { id: "cat_subs", name: "Subscriptions", icon: "repeat", iconBg: "#8B5CF6", monthlyLimit: 2000, color: "#8B5CF6", createdAt: "2025-01-01", subCategories: ["Streaming", "Software", "Gym"] },
  { id: "cat_transport", name: "Transport", icon: "car", iconBg: "#3B82F6", monthlyLimit: 3000, color: "#3B82F6", createdAt: "2025-01-01", subCategories: ["Fuel", "Cabs", "Public Transit"] },
  { id: "cat_ent", name: "Entertainment", icon: "tv", iconBg: "#EC4899", monthlyLimit: 4000, color: "#EC4899", createdAt: "2025-01-01", subCategories: ["Movies", "Gaming", "Concerts"] },
  { id: "cat_utils", name: "Utilities & Bills", icon: "zap", iconBg: "#EAB308", monthlyLimit: 6000, color: "#EAB308", createdAt: "2025-01-01", subCategories: ["Electricity", "Water", "Internet", "Mobile"] },
  { id: "cat_health", name: "Health & Fitness", icon: "heart", iconBg: "#EF4444", monthlyLimit: 3000, color: "#EF4444", createdAt: "2025-01-01", subCategories: ["Medicine", "Checkups", "Gym"] },
  { id: "cat_shopping", name: "Shopping", icon: "shopping-bag", iconBg: "#06B6D4", monthlyLimit: 5000, color: "#06B6D4", createdAt: "2025-01-01", subCategories: ["Clothing", "Electronics", "Gifts"] },
  { id: "cat_edu", name: "Education", icon: "graduation-cap", iconBg: "#F97316", monthlyLimit: 2000, color: "#F97316", createdAt: "2025-01-01", subCategories: ["Books", "Courses", "Stationery"] },
];

function seedTxns(month: number, year: number): Transaction[] {
  const d = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return [
    { id: "seed1", categoryId: "cat_food", amount: 450, note: "Lunch", date: d(3), type: "expense", subCategory: "Restaurants" },
    { id: "seed2", categoryId: "cat_food", amount: 280, note: "Breakfast", date: d(5), type: "expense", subCategory: "Cafes" },
    { id: "seed3", categoryId: "cat_food", amount: 600, note: "Dinner out", date: d(8), type: "expense", subCategory: "Restaurants" },
    { id: "seed4", categoryId: "cat_groceries", amount: 1800, note: "Weekly groceries", date: d(4), type: "expense", subCategory: "Supermarket" },
    { id: "seed5", categoryId: "cat_subs", amount: 149, note: "Netflix", date: d(1), type: "expense", subCategory: "Streaming" },
    { id: "seed6", categoryId: "cat_transport", amount: 320, note: "Fuel", date: d(6), type: "expense", subCategory: "Fuel" },
  ];
}

function dateToMonthKey(date: string): { month: number; year: number } {
  const parts = date.split("-");
  return { year: parseInt(parts[0]), month: parseInt(parts[1]) - 1 };
}

/** Scale all categories proportionally to hit a target total budget */
function scaleCategoriesToBudget(cats: BudgetCategory[], targetTotal: number): BudgetCategory[] {
  const currentTotal = cats.reduce((s, c) => s + c.monthlyLimit, 0);
  if (currentTotal === 0) return cats;
  const ratio = targetTotal / currentTotal;
  return cats.map((c) => ({ ...c, monthlyLimit: Math.round(c.monthlyLimit * ratio) }));
}

const now = new Date();
const CM = now.getMonth();
const CY = now.getFullYear();
const DEFAULT_RANGE = getMonthDateRange(CM, CY);

export function useBudget() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_RANGE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cats = getCategories();
    if (cats.length === 0) { cats = SEED_CATS; saveCategories(cats); }
    // Load transactions across all months that overlap the range
    const from = dateToMonthKey(dateRange.startDate);
    const to = dateToMonthKey(dateRange.endDate);
    let txns = getTransactionsForRange(from.month, from.year, to.month, to.year);
    // Seed current month if empty
    if (txns.length === 0 && dateRange.startDate === DEFAULT_RANGE.startDate && dateRange.endDate === DEFAULT_RANGE.endDate) {
      txns = seedTxns(CM, CY);
      const mk = dateToMonthKey(txns[0].date);
      saveTransactions(mk.month, mk.year, txns);
    }
    setCategories(cats);
    setTransactions(txns);
    setLoaded(true);
  }, [dateRange]);

  const addTransaction = useCallback(
    (t: Omit<Transaction, "id">) => {
      const txn: Transaction = { ...t, id: generateId() };
      const mk = dateToMonthKey(t.date);
      storeAddTxn(mk.month, mk.year, txn);
      setTransactions((prev) => [...prev, txn]);
    },
    []
  );

  const deleteTransaction = useCallback(
    (txnId: string) => {
      // Find the transaction to get its date
      setTransactions((prev) => {
        const txn = prev.find((t) => t.id === txnId);
        if (txn) {
          const mk = dateToMonthKey(txn.date);
          storeDeleteTxn(mk.month, mk.year, txnId);
        }
        return prev.filter((t) => t.id !== txnId);
      });
    },
    []
  );

  const addCategory = useCallback((cat: Omit<BudgetCategory, "id" | "createdAt">) => {
    const newCat: BudgetCategory = { ...cat, id: generateId(), createdAt: new Date().toISOString() };
    const cats = [...getCategories(), newCat];
    saveCategories(cats);
    setCategories(cats);
    return newCat;
  }, []);

  const deleteCategory = useCallback(
    (catId: string) => {
      const cats = getCategories().filter((c) => c.id !== catId);
      saveCategories(cats);
      setCategories(cats);
      // Delete from all months in the current range
      const from = dateToMonthKey(dateRange.startDate);
      const to = dateToMonthKey(dateRange.endDate);
      let m = from.month, y = from.year;
      while (true) {
        storeDeleteCatTxns(m, y, catId);
        if (m === to.month && y === to.year) break;
        m++;
        if (m > 11) { m = 0; y++; }
      }
      setTransactions((prev) => prev.filter((t) => t.categoryId !== catId));
    },
    [dateRange]
  );

  const changeDateRange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<BudgetCategory>) => {
    storeUpdateCategory(id, updates);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => {
      const txn = prev.find((t) => t.id === id);
      if (txn) {
        const mk = dateToMonthKey(txn.date);
        const currentTxns = getTransactions(mk.month, mk.year);
        const updatedTxns = currentTxns.map((t) => (t.id === id ? { ...t, ...updates } : t));
        saveTransactions(mk.month, mk.year, updatedTxns);
      }
      return prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
    });
  }, []);

  const summary = useMemo<BudgetSummary>(() => {
    return computeBudgetSummary(categories, transactions, dateRange);
  }, [categories, transactions, dateRange]);

  return { 
    loaded, 
    dateRange, 
    categories, 
    transactions, 
    summary, 
    addTransaction, 
    deleteTransaction, 
    addCategory, 
    deleteCategory, 
    changeDateRange, 
    updateCategory, 
    updateTransaction 
  };
}
