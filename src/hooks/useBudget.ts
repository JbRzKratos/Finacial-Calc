"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { BudgetCategory, Transaction, BudgetSummary } from "@/lib/budget/budgetTypes";
import { getCategories, saveCategories, getTransactions, saveTransactions, addTransaction as storeAddTxn, deleteTransaction as storeDeleteTxn, deleteCategoryTransactions } from "@/lib/budget/budgetStore";
import { computeBudgetSummary, generateId } from "@/lib/budget/budgetCalc";

const SEED_CATS: BudgetCategory[] = [
  { id: "cat_food", name: "Food", icon: "🍔", iconBg: "#FF6B00", monthlyLimit: 8000, color: "#FF6B00", createdAt: "2025-01-01" },
  { id: "cat_groceries", name: "Groceries", icon: "🛒", iconBg: "#14B8A6", monthlyLimit: 5000, color: "#14B8A6", createdAt: "2025-01-01" },
  { id: "cat_subs", name: "Subscriptions", icon: "🔄", iconBg: "#8B5CF6", monthlyLimit: 2000, color: "#8B5CF6", createdAt: "2025-01-01" },
  { id: "cat_transport", name: "Transport", icon: "🚗", iconBg: "#3B82F6", monthlyLimit: 3000, color: "#3B82F6", createdAt: "2025-01-01" },
];

function seedTxns(month: number, year: number): Transaction[] {
  const d = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return [
    { id: "seed1", categoryId: "cat_food", amount: 450, note: "Lunch", date: d(3), type: "expense" },
    { id: "seed2", categoryId: "cat_food", amount: 280, note: "Breakfast", date: d(5), type: "expense" },
    { id: "seed3", categoryId: "cat_food", amount: 600, note: "Dinner out", date: d(8), type: "expense" },
    { id: "seed4", categoryId: "cat_groceries", amount: 1800, note: "Weekly groceries", date: d(4), type: "expense" },
    { id: "seed5", categoryId: "cat_subs", amount: 149, note: "Netflix", date: d(1), type: "expense" },
    { id: "seed6", categoryId: "cat_transport", amount: 320, note: "Fuel", date: d(6), type: "expense" },
  ];
}

const now = new Date();
const CM = now.getMonth();
const CY = now.getFullYear();

export function useBudget() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(CM);
  const [year, setYear] = useState(CY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cats = getCategories();
    if (cats.length === 0) { cats = SEED_CATS; saveCategories(cats); }
    let txns = getTransactions(month, year);
    if (txns.length === 0 && month === CM && year === CY) { txns = seedTxns(month, year); saveTransactions(month, year, txns); }
    setCategories(cats);
    setTransactions(txns);
    setLoaded(true);
  }, [month, year]);

  const addTransaction = useCallback(
    (t: Omit<Transaction, "id">) => {
      const txn: Transaction = { ...t, id: generateId() };
      storeAddTxn(month, year, txn);
      setTransactions((prev) => [...prev, txn]);
    },
    [month, year]
  );

  const deleteTransaction = useCallback(
    (txnId: string) => {
      storeDeleteTxn(month, year, txnId);
      setTransactions((prev) => prev.filter((t) => t.id !== txnId));
    },
    [month, year]
  );

  const addCategory = useCallback((cat: Omit<BudgetCategory, "id" | "createdAt">) => {
    const newCat: BudgetCategory = { ...cat, id: generateId(), createdAt: new Date().toISOString() };
    const cats = getCategories();
    cats.push(newCat);
    saveCategories(cats);
    setCategories(cats);
    return newCat;
  }, []);

  const deleteCategory = useCallback(
    (catId: string) => {
      const cats = getCategories().filter((c) => c.id !== catId);
      saveCategories(cats);
      setCategories(cats);
      deleteCategoryTransactions(month, year, catId);
      setTransactions((prev) => prev.filter((t) => t.categoryId !== catId));
    },
    [month, year]
  );

  const changeMonth = useCallback((m: number, y: number) => { setMonth(m); setYear(y); }, []);

  const summary = useMemo<BudgetSummary>(() => computeBudgetSummary(categories, transactions), [categories, transactions]);

  return { loaded, month, year, categories, transactions, summary, addTransaction, deleteTransaction, addCategory, deleteCategory, changeMonth };
}
