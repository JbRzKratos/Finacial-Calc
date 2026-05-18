"use client";

import { useState, useCallback, useEffect } from "react";
import { CalculatorInputs, CalculatorResult } from "@/types/calculator";
import { saveState, loadState } from "@/lib/storage";

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
  const [state, setState] = useState<{ inputs: CalculatorInputs; result: CalculatorResult }>(() => ({
    inputs: { ...defaultInputs },
    result: calcFn(defaultInputs),
  }));

  useEffect(() => {
    const saved = loadState(calcId);
    if (saved) {
      const merged = { ...defaultInputs, ...saved };
      setState({ inputs: merged, result: calcFn(merged) });
    }
  }, [calcId]);

  const updateInput = useCallback((key: string, value: number | string | boolean) => {
    setState(prev => {
      const nextInputs = { ...prev.inputs, [key]: value };
      saveState(calcId, nextInputs);
      return { inputs: nextInputs, result: calcFn(nextInputs) };
    });
  }, [calcId, calcFn]);

  const resetInputs = useCallback(() => {
    const inputs = { ...defaultInputs };
    saveState(calcId, inputs);
    setState({ inputs, result: calcFn(inputs) });
  }, [calcId, defaultInputs, calcFn]);

  return { inputs: state.inputs, result: state.result, updateInput, resetInputs };
}
