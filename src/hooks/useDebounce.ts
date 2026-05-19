import { useRef, useCallback } from "react";

export function useDebounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  const rafRef = useRef<number | null>(null);
  const lastArgs = useRef<unknown[]>([]);

  return useCallback((...args: unknown[]) => {
    lastArgs.current = args;
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      fn(...lastArgs.current);
      rafRef.current = null;
    });
  }, [fn, delay]) as unknown as T;
}
