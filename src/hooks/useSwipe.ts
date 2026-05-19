"use client";

import { useCallback, useRef } from "react";

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 60 }: SwipeConfig) {
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    startTime.current = Date.now();
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - startX.current;
    const deltaY = e.changedTouches[0].clientY - startY.current;
    const deltaTime = Date.now() - startTime.current;

    if (deltaTime > 400) return;
    if (Math.abs(deltaX) < threshold) return;
    if (Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;

    if (deltaX > 0) {
      onSwipeRight?.();
    } else {
      onSwipeLeft?.();
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return { onTouchStart, onTouchEnd };
}
