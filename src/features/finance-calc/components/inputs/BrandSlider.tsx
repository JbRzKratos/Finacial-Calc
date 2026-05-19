"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BrandSliderProps {
  stops: { value: number; label: string }[];
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function BrandSlider({ stops, value, onChange, className }: BrandSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);

  const sorted = [...stops].sort((a, b) => a.value - b.value);
  const minVal = sorted[0].value;
  const maxVal = sorted[sorted.length - 1].value;

  const pct = ((value - minVal) / (maxVal - minVal)) * 100;

  const getValueFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const raw = minVal + ratio * (maxVal - minVal);
    const closest = sorted.reduce((prev, curr) =>
      Math.abs(curr.value - raw) < Math.abs(prev.value - raw) ? curr : prev
    );
    return closest.value;
  }, [value, minVal, maxVal, sorted]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    const v = getValueFromX(e.clientX);
    onChange(v);
  }, [getValueFromX, onChange]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: PointerEvent) => {
      const v = getValueFromX(e.clientX);
      onChange(v);
    };
    const handleUp = () => setDragging(false);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragging, getValueFromX, onChange]);

  return (
    <div className={cn("select-none touch-none", className)}>
      <div
        ref={trackRef}
        className="relative h-11 flex items-center cursor-pointer"
        onPointerDown={handlePointerDown}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="absolute left-0 right-0 h-[3px] bg-white/30 rounded-full pointer-events-none" />
        <div
          className="absolute left-0 h-[3px] bg-white rounded-full pointer-events-none"
          style={{ width: pct + "%", transition: "width 0.1s ease" }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white border-2 border-brand-black shadow-sm pointer-events-none"
          style={{
            left: "calc(" + pct + "% - 9px)",
            transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
            transform: "translateY(-50%) " + (dragging ? "scale(1.35)" : hovering ? "scale(1.2)" : ""),
            boxShadow: dragging
              ? "0 0 0 10px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,0.2)"
              : hovering
              ? "0 0 0 6px rgba(255,255,255,0.15)"
              : "none",
          }}
        />
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-between px-[2px]">
          {sorted.map((stop) => {
            const stopPct = ((stop.value - minVal) / (maxVal - minVal)) * 100;
            const active = value >= stop.value;
            return (
              <div
                key={stop.value}
                className="absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full pointer-events-none"
                style={{
                  left: "calc(" + stopPct + "% - 4px)",
                  backgroundColor: active ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                  transition: "background-color 0.15s ease",
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-1.5 px-[2px]">
        {sorted.map((stop) => (
          <span
            key={stop.value}
            className="text-[11px] uppercase text-white/80 font-medium"
          >
            {stop.label}
          </span>
        ))}
      </div>
    </div>
  );
}
