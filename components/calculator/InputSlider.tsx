"use client";

import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { HelpTooltip } from "./HelpTooltip";
import { CalcIcon } from "@/components/shared/CalcIcon";

interface InputSliderProps {
  id: string;
  label: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: "₹" | "%" | "yr" | "mo";
  unitPosition: "prefix" | "suffix";
  helperText: string;
  helpContent?: string;
  formatValue?: (v: number) => string;
  onChange: (value: number) => void;
}

export function InputSlider({
  id, label, icon, value, min, max, step, unit, unitPosition,
  helperText, helpContent, formatValue, onChange
}: InputSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const [inputStr, setInputStr] = useState(formatValue ? formatValue(value) : String(value));

  const handleSliderChange = useCallback((vals: number[]) => {
    const v = vals[0];
    setLocalValue(v);
    setInputStr(formatValue ? formatValue(v) : String(v));
    onChange(v);
  }, [onChange, formatValue]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputStr(e.target.value);
  }, []);

  const handleInputBlur = useCallback(() => {
    let v = parseFloat(inputStr.replace(/[₹,%,\s]/g, ""));
    if (isNaN(v) || v < min) v = min;
    if (v > max) v = max;
    const rounded = Math.round(v / step) * step;
    setLocalValue(rounded);
    setInputStr(formatValue ? formatValue(rounded) : String(rounded));
    onChange(rounded);
  }, [inputStr, min, max, step, formatValue, onChange]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleInputBlur();
  }, [handleInputBlur]);

  const displayValue = formatValue ? formatValue(localValue) :
    unitPosition === "prefix" ? `${unit}${localValue.toLocaleString("en-IN")}` :
    `${localValue}${unit}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium flex items-center gap-1.5">
          <CalcIcon name={icon} className="w-4 h-4" />
          <span>{label}</span>
          {helpContent && <HelpTooltip content={helpContent} />}
        </Label>
        <span className="text-sm font-semibold tabular-nums">{displayValue}</span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[localValue]}
        onValueChange={handleSliderChange}
        className="py-1"
      />
      <div className="flex items-center gap-2">
        {unitPosition === "prefix" && (
          <span className="text-muted-foreground text-xs font-medium">{unit}</span>
        )}
        <Input
          type="text"
          inputMode="numeric"
          value={inputStr}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="h-11 text-sm font-medium tabular-nums w-32"
          style={{ fontSize: 16 }}
        />
        {unitPosition === "suffix" && (
          <span className="text-muted-foreground text-xs font-medium">{unit}</span>
        )}
        <span className="text-[11px] text-muted-foreground ml-auto">
          {unitPosition === "prefix" ? `${unit}${min.toLocaleString("en-IN")}` : `${min}${unit}`} – {unitPosition === "prefix" ? `${unit}${max.toLocaleString("en-IN")}` : `${max}${unit}`}
        </span>
      </div>
      <p className="text-xs text-muted-foreground/80 leading-relaxed">{helperText}</p>
    </div>
  );
}
