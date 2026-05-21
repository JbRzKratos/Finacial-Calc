"use client";

import { useCallback, useRef, useState, useEffect, ChangeEvent, FocusEvent } from "react";
import { Slider } from "@/components/ui/slider";

interface NeonSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  tickLabels?: string[];
  editable?: boolean;
}

export function NeonSlider({ label, value, onChange, min, max, step, unit, tickLabels, editable }: NeonSliderProps) {
  const [inputText, setInputText] = useState<string>(String(Math.round(value)));
  const [isFocused, setIsFocused] = useState(false);
  const inputId = `slider-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    if (!isFocused) {
      setInputText(String(Math.round(value)));
    }
  }, [value, isFocused]);

  const fmt = (v: number) => {
    if (step < 1) return v.toFixed(1);
    return String(Math.round(v));
  };

  const fmtLocale = (v: number) => {
    return Math.round(v).toLocaleString("en-IN");
  };

  const handleSliderChange = useCallback((v: number[]) => {
    onChange(v[0]);
  }, [onChange]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputText(raw);
    const val = parseFloat(raw);
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    let val = parseFloat(inputText);
    if (isNaN(val) || val < min) val = min;
    if (val > max) val = max;
    setInputText(String(Math.round(val)));
    onChange(val);
  };

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  const stepValue = (dir: number) => {
    const newVal = Math.min(max, Math.max(min, value + dir * step));
    onChange(newVal);
  };

  const defaultTicks = tickLabels || [
    fmt(min) + " " + unit,
    fmt(min + (max - min) * 0.25) + " " + unit,
    fmt(min + (max - min) * 0.5) + " " + unit,
    fmt(min + (max - min) * 0.75) + " " + unit,
    fmt(max) + " " + unit,
  ];

  return (
    <div className="flex flex-col gap-2.5 w-full py-4 border-b border-white/[0.06]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">{label}</span>
        {editable ? (
          <div className="flex items-center gap-0.5 bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.3)] rounded-lg px-2 py-1 focus-within:border-[rgba(255,107,0,0.7)] focus-within:shadow-[0_0_0_3px_rgba(255,107,0,0.12)] transition-all">
            <button
              type="button"
              onClick={() => stepValue(-1)}
              className="flex items-center justify-center w-5 h-5 rounded border-none bg-[rgba(255,107,0,0.15)] text-[#FF6B00] cursor-pointer p-0 transition-all hover:bg-[rgba(255,107,0,0.3)] active:scale-90 shrink-0"
              aria-label="Decrease value"
              tabIndex={-1}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14"/>
              </svg>
            </button>
            <span className="text-sm font-semibold text-[#FF6B00] select-none px-0.5">₹</span>
            <input
              id={inputId}
              type="number"
              className="bg-none border-none outline-none font-mono text-sm font-semibold text-[#FF6B00] w-[72px] text-right p-0 m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={inputText}
              min={min}
              max={max}
              step={step}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              aria-label={"Enter " + label.toLowerCase()}
            />
            <button
              type="button"
              onClick={() => stepValue(1)}
              className="flex items-center justify-center w-5 h-5 rounded border-none bg-[rgba(255,107,0,0.15)] text-[#FF6B00] cursor-pointer p-0 transition-all hover:bg-[rgba(255,107,0,0.3)] active:scale-90 shrink-0"
              aria-label="Increase value"
              tabIndex={-1}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        ) : (
          <span className="flex items-baseline gap-0.5 bg-[rgba(255,107,0,0.12)] border border-[rgba(255,107,0,0.3)] rounded-lg px-2.5 py-1">
            <span className="font-mono text-base font-semibold text-[#FF6B00] leading-none">{fmt(value)}</span>
            <span className="text-[10px] font-semibold text-[rgba(255,107,0,0.55)] tracking-[0.08em]">{unit}</span>
          </span>
        )}
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        aria-label={label}
      />
      <div className="flex justify-between px-0.5">
        {defaultTicks.map((t, i) => (
          <span key={`${t}-${i}`} className="font-mono text-[10px] text-white/30 tracking-[0.04em]">{t}</span>
        ))}
      </div>
    </div>
  );
}
