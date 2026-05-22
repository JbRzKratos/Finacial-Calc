
import { memo, useCallback, useRef, useState, useEffect, ChangeEvent, FocusEvent } from "react";
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

function fmt(v: number, s: number) {
  const abs = Math.abs(v);
  if (s < 1) return v.toFixed(1);
  if (abs >= 10000000) return (abs / 10000000).toFixed(1) + "C";
  if (abs >= 100000) return (abs / 100000).toFixed(1) + "L";
  if (abs >= 1000) return (abs / 1000).toFixed(1) + "K";
  return String(Math.round(abs));
}

function NeonSliderInner({ label, value, onChange, min, max, step, unit, tickLabels, editable }: NeonSliderProps) {
  const [inputText, setInputText] = useState(() => String(Math.round(value)));
  const inputId = `slider-input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (!isFocusedRef.current) {
      setInputText(String(Math.round(value)));
    }
  }, [value]);

  const rafRef = useRef<number | null>(null);

  const handleSliderChange = useCallback((v: number[]) => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      onChange(v[0]);
    });
  }, [onChange]);

  const handleSliderCommit = useCallback((v: number[]) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    onChange(v[0]);
  }, [onChange]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputText(raw);
    const val = parseFloat(raw);
    if (!isNaN(val)) {
      onChange(val);
    }
  }, [onChange]);

  const handleInputBlur = useCallback(() => {
    isFocusedRef.current = false;
    let val = parseFloat(inputText);
    if (isNaN(val) || val < min) val = min;
    if (val > max) val = max;
    setInputText(String(Math.round(val)));
    onChange(val);
  }, [inputText, min, max, onChange]);

  const handleInputFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    e.target.select();
  }, []);

  const stepValue = useCallback((dir: number) => {
    const newVal = Math.min(max, Math.max(min, value + dir * step));
    onChange(newVal);
  }, [min, max, value, step, onChange]);

  const defaultTicks = tickLabels || [
    fmt(min, step) + " " + unit,
    fmt(min + (max - min) * 0.25, step) + " " + unit,
    fmt(min + (max - min) * 0.5, step) + " " + unit,
    fmt(min + (max - min) * 0.75, step) + " " + unit,
    fmt(max, step) + " " + unit,
  ];

  const badgeValue = fmt(value, step);

  return (
    <div className="flex flex-col gap-2.5 w-full py-4 border-b border-white/[0.06]">
      <div className="flex items-center justify-between">
        <span className="text-[clamp(10px,2.6vw,12px)] font-semibold tracking-[0.12em] text-white/45 uppercase">{label}</span>
        {editable ? (
          <div className="badge-input-row">
            <button
              type="button"
              onClick={() => stepValue(-1)}
              className="stepper-btn"
              aria-label="Decrease value"
              tabIndex={-1}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14"/>
              </svg>
            </button>
            <span className="badge-currency-symbol">₹</span>
            <input
              id={inputId}
              type="number"
              className="badge-input-value"
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
              className="stepper-btn"
              aria-label="Increase value"
              tabIndex={-1}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        ) : (
          <span className="badge-chip">
            <span className="badge-chip-value">{badgeValue}</span>
            <span className="badge-chip-unit">{unit}</span>
          </span>
        )}
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        onValueCommit={handleSliderCommit}
        min={min}
        max={max}
        step={step}
        aria-label={label}
      />
      <div className="flex justify-between px-0.5 pb-1">
        {defaultTicks.map((t, i) => (
          <span key={`${t}-${i}`} className="font-mono text-[clamp(9px,2.3vw,10px)] text-white/30 tracking-[0.04em] whitespace-nowrap">{t}</span>
        ))}
      </div>
    </div>
  );
}

export const NeonSlider = memo(NeonSliderInner);
NeonSlider.displayName = 'NeonSlider';
