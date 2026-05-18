"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CalculatorInputs, CalculatorResult } from "@/types/calculator";
import { saveState, loadState } from "@/lib/storage";

interface CalculatorHookReturn {
  inputs: CalculatorInputs;
  result: CalculatorResult | null;
  updateInput: (key: string, value: number | string | boolean) => void;
  resetInputs: () => void;
  calculate: () => void;
}

export function useCalculator(
  calcId: string,
  defaultInputs: CalculatorInputs,
  calcFn: (inputs: CalculatorInputs) => CalculatorResult
): CalculatorHookReturn {
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    const saved = loadState(calcId);
    return saved ? { ...defaultInputs, ...saved } : { ...defaultInputs };
  });
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const rafRef = useRef<number | null>(null);

  const calculate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setResult(calcFn(inputs));
      rafRef.current = null;
    });
  }, [inputs, calcFn]);

  const updateInput = useCallback((key: string, value: number | string | boolean) => {
    setInputs(prev => {
      const next = { ...prev, [key]: value };
      saveState(calcId, next);
      return next;
    });
  }, [calcId]);

  const resetInputs = useCallback(() => {
    const defaults = { ...defaultInputs };
    setInputs(defaults);
    saveState(calcId, defaults);
  }, [calcId, defaultInputs]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return { inputs, result, updateInput, resetInputs, calculate };
}
