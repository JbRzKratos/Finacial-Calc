"use client";

import { useCallback, useRef, useState, useEffect, ChangeEvent, FocusEvent } from "react";

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
  const sliderRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [inputText, setInputText] = useState<string>(String(Math.round(value)));
  const [isFocused, setIsFocused] = useState(false);

  /* Sync input text from value prop when not being edited */
  useEffect(() => {
    if (!isFocused) {
      setInputText(String(Math.round(value)));
    }
  }, [value, isFocused]);

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const fmt = (v: number) => {
    if (step < 1) return v.toFixed(1);
    return String(Math.round(v));
  };

  const fmtLocale = (v: number) => {
    return Math.round(v).toLocaleString("en-IN");
  };

  const handleSliderChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    onChange(v);
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

  const defaultTicks = tickLabels || [
    fmt(min) + " " + unit,
    fmt(min + (max - min) * 0.25) + " " + unit,
    fmt(min + (max - min) * 0.5) + " " + unit,
    fmt(min + (max - min) * 0.75) + " " + unit,
    fmt(max) + " " + unit,
  ];

  return (
    <div className="slider-wrapper">
      <div className="slider-label-row">
        <span className="slider-label">{label}</span>
        {editable ? (
          <div className="slider-value-input-wrap">
            <span className="slider-currency-symbol">₹</span>
            <input
              type="number"
              className="slider-value-input"
              value={inputText}
              min={min}
              max={max}
              step={step}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              aria-label={"Enter " + label.toLowerCase()}
            />
          </div>
        ) : (
          <span className="slider-value-display">
            <span className="slider-value-number">{fmt(value)}</span>
            <span className="slider-value-unit">{unit}</span>
          </span>
        )}
      </div>
      <div ref={trackRef} className={"slider-track-container" + (active ? " active" : "")}>
        <div className="slider-fill-track" style={{ width: pct + "%" }} />
        <div className="slider-thumb-dot" style={{ left: pct + "%" }} />
        <div className="slider-thumb-bubble" style={{ left: pct + "%" }}>{editable ? "₹" + fmtLocale(value) : fmt(value)}</div>
        <input
          ref={sliderRef}
          type="range"
          className="custom-slider"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          onMouseDown={() => setActive(true)}
          onTouchStart={() => setActive(true)}
          onMouseUp={() => setActive(false)}
          onTouchEnd={() => setActive(false)}
        />
      </div>
      <div className="slider-ticks-row">
        {defaultTicks.map((t, i) => (
          <span key={i} className="tick-label">{t}</span>
        ))}
      </div>
    </div>
  );
}
