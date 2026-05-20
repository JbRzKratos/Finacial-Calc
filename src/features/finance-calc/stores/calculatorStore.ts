"use client";

import { create } from "zustand";

interface CalcStore {
  inputs: Record<string, Record<string, unknown>>;
  setInputs: (id: string, inputs: Record<string, unknown>) => void;
  clearInputs: (id: string) => void;
}

const STORAGE_KEY = "calc-storage";

function loadFromStorage(): Record<string, Record<string, unknown>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(inputs: Record<string, Record<string, unknown>>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch {}
}

export const useCalcStore = create<CalcStore>((set, get) => ({
  inputs: loadFromStorage(),
  setInputs: (id, inputs) => {
    const next = { ...get().inputs, [id]: inputs };
    saveToStorage(next);
    set({ inputs: next });
  },
  clearInputs: (id) => {
    const next = { ...get().inputs };
    delete next[id];
    saveToStorage(next);
    set({ inputs: next });
  },
}));
