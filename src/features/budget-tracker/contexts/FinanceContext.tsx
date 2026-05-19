"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import type { Transaction, FinanceState, FinanceAction } from "../types/budget";
import { STORAGE_KEY, INITIAL_TRANSACTIONS } from "../utils/constants";

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { transactions: [action.payload, ...state.transactions] };
    case "DELETE_TRANSACTION":
      return { transactions: state.transactions.filter((t) => t.id !== action.payload) };
    case "LOAD_DATA":
      return { transactions: action.payload };
    case "RESET":
      return { transactions: INITIAL_TRANSACTIONS };
    default:
      return state;
  }
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  exportData: () => string;
  resetData: () => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_TRANSACTIONS;
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, { transactions: [] });

  useEffect(() => {
    dispatch({ type: "LOAD_DATA", payload: loadTransactions() });
  }, []);

  useEffect(() => {
    if (state.transactions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
    }
  }, [state.transactions]);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    dispatch({ type: "ADD_TRANSACTION", payload: { ...t, id } });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(state.transactions, null, 2);
  }, [state.transactions]);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESET" });
  }, []);

  return (
    <FinanceContext.Provider value={{ transactions: state.transactions, addTransaction, deleteTransaction, exportData, resetData }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextType {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
