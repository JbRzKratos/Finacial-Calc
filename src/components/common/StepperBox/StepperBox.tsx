"use client";

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface InputRowField {
  value: number;
  onChange: (value: string) => void;
  label: string;
  suffix?: string;
  step?: number;
}

interface InputRowProps {
  fields: InputRowField[];
  className?: string;
}

function fmtDisplay(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 10000000) return sign + (abs / 10000000).toFixed(1) + "C";
  if (abs >= 100000) return sign + (abs / 100000).toFixed(1) + "L";
  if (abs >= 1000) return sign + (abs / 1000).toFixed(1) + "K";
  return sign + String(Math.round(abs));
}

function InputRowInner({ fields, className }: InputRowProps) {
  return (
    <div className={cn("stepper-row", className)}>
      {fields.map((field, i) => {
        const id = `calc-${field.label.toLowerCase().replace(/\s+/g, '-')}-${i}`;
        const hasStep = field.step !== undefined;
        return (
          <StepperCol key={`${field.label}-${i}`} field={field} id={id} hasStep={hasStep} />
        );
      })}
    </div>
  );
}

export const InputRow = memo(InputRowInner);
InputRow.displayName = 'InputRow';

interface StepperColProps {
  field: InputRowField;
  id: string;
  hasStep: boolean;
}

const StepperCol = memo(function StepperCol({ field, id, hasStep }: StepperColProps) {
  const stepVal = useCallback((dir: number) => {
    const step = field.step || 1;
    field.onChange(String(field.value + dir * step));
  }, [field.value, field.step, field.onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value.replace(/[^0-9.\-]/g, ""));
  }, [field.onChange]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = String(field.value);
    e.target.select();
  }, [field.value]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = fmtDisplay(field.value);
  }, [field.value]);

  return (
    <div className="stepper-col">
      <label htmlFor={id} className="stepper-col-label">{field.label}</label>
      <div className="stepper-control">
        {hasStep && (
          <button
            type="button"
            onClick={() => stepVal(-1)}
            className="stepper-btn"
            aria-label={`Decrease ${field.label.toLowerCase()}`}
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14"/></svg>
          </button>
        )}
        <div className="stepper-value-box">
          <div className="stepper-value-inner">
            <input
              id={id}
              type="text"
              inputMode="decimal"
              defaultValue={fmtDisplay(field.value)}
              key={field.value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="stepper-number"
            />
            {field.suffix && <span className="stepper-unit">{field.suffix}</span>}
          </div>
        </div>
        {hasStep && (
          <button
            type="button"
            onClick={() => stepVal(1)}
            className="stepper-btn"
            aria-label={`Increase ${field.label.toLowerCase()}`}
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        )}
      </div>
    </div>
  );
});
StepperCol.displayName = 'StepperCol';
