"use client";

import { useState, useCallback, useEffect } from "react";
import { CalculatorInputs, CalculatorResult } from "@/features/finance-calc/types/calculator";
import { useCalcStore } from "@/features/finance-calc/stores/calculatorStore";

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

  const [state, setState] = useState<{ inputs: CalculatorInputs; result: CalculatorResult }>(() => {
    const saved = storedInputs[calcId];
    const merged = saved ? { ...defaultInputs, ...saved } : { ...defaultInputs };
    return { inputs: merged, result: calcFn(merged) };
  });

  useEffect(() => {
    const saved = storedInputs[calcId];
    if (saved) {
      const merged = { ...defaultInputs, ...saved };
      setState({ inputs: merged, result: calcFn(merged) });
    }
  }, [calcId]);

  const updateInput = useCallback((key: string, value: number | string | boolean) => {
    setState(prev => {
      const nextInputs = { ...prev.inputs, [key]: value };
      setInputs(calcId, nextInputs);
      return { inputs: nextInputs, result: calcFn(nextInputs) };
    });
  }, [calcId, calcFn, setInputs]);

  const resetInputs = useCallback(() => {
    const inputs = { ...defaultInputs };
    clearInputs(calcId);
    setState({ inputs, result: calcFn(inputs) });
  }, [calcId, defaultInputs, calcFn, clearInputs]);

  return { inputs: state.inputs, result: state.result, updateInput, resetInputs };
}
