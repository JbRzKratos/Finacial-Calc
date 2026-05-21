"use client";

import { useState, useCallback, useMemo, useEffect, useDeferredValue } from "react";
import type { CalculatorInputs, CalculatorResult } from "@/types";
import { useCalcStore } from "@/store";

interface CalculatorHookReturn {
  inputs: CalculatorInputs;
  result: CalculatorResult | null;
  updateInput: (key: string, value: number | string | boolean) => void;
  resetInputs: () => void;
}

export function useCalculator(
  calcId: string,
  defaultInputs: CalculatorInputs,
  calcFn: (inputs: CalculatorInputs) => CalculatorResult
): CalculatorHookReturn {
  const { inputs: storedInputs, setInputs, clearInputs } = useCalcStore();

  const [inputs, setInputsState] = useState<CalculatorInputs>(() => {
    const saved = storedInputs[calcId];
    return saved ? { ...defaultInputs, ...saved } : { ...defaultInputs };
  });

  const deferredInputs = useDeferredValue(inputs);

  useEffect(() => {
    setInputs(calcId, deferredInputs);
  }, [deferredInputs, calcId, setInputs]);

  const result = useMemo(() => calcFn(deferredInputs), [deferredInputs, calcFn]);

  const updateInput = useCallback((key: string, value: number | string | boolean) => {
    setInputsState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetInputs = useCallback(() => {
    const next = { ...defaultInputs };
    setInputsState(next);
    clearInputs(calcId);
  }, [calcId, defaultInputs, clearInputs]);

  return { inputs, result, updateInput, resetInputs };
}
