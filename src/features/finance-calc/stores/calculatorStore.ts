"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CalculatorInputs } from "@/features/finance-calc/types/calculator";

interface CalcStore {
  inputs: Record<string, CalculatorInputs>;
  setInputs: (calcId: string, data: CalculatorInputs) => void;
  clearInputs: (calcId: string) => void;
}

export const useCalcStore = create<CalcStore>()(
  persist(
    (set) => ({
      inputs: {},
      setInputs: (calcId, data) =>
        set((state) => ({
          inputs: { ...state.inputs, [calcId]: data },
        })),
      clearInputs: (calcId) =>
        set((state) => {
          const next = { ...state.inputs };
          delete next[calcId];
          return { inputs: next };
        }),
    }),
    {
      name: "fincalc_store",
      partialize: (state) => ({ inputs: state.inputs }),
    }
  )
);
