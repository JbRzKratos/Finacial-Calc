import { useRef, useCallback } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe(handlers: SwipeHandlers, threshold = 60) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = e.target as HTMLElement;
    if (el.closest("input") || el.closest("select") || el.closest(".mobile-nav")) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = true;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) handlers.onSwipeLeft?.();
      else handlers.onSwipeRight?.();
    }
  }, [handlers, threshold]);

  return { onTouchStart, onTouchEnd };
}
