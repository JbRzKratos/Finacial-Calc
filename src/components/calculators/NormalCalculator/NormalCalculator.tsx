/* src/components/calculators/NormalCalculator/NormalCalculator.tsx */

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logCalculatorUsage } from "@/utils/history";

export default function NormalCalculator() {
  const [expression, setExpression] = React.useState<string>("");
  const [result, setResult] = React.useState<string>("");
  const [hasEvaluated, setHasEvaluated] = React.useState<boolean>(false);

  // Keypad configuration
  // Each item has: label (displayed), type (number, operator, action), value (optional, for math)
  const buttons = [
    { label: "C", type: "action", className: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-red-500/20" },
    { label: "⌫", type: "action", className: "bg-muted/40 text-muted-foreground hover:bg-muted/70" },
    { label: "%", type: "operator", value: "%", className: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" },
    { label: "÷", type: "operator", value: "÷", className: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold text-lg" },
    
    { label: "7", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "8", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "9", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "×", type: "operator", value: "×", className: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold text-lg" },
    
    { label: "4", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "5", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "6", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "-", type: "operator", value: "-", className: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold text-xl" },
    
    { label: "1", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "2", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "3", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "+", type: "operator", value: "+", className: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold text-lg" },
    
    { label: "0", type: "number", className: "col-span-2 bg-card/50 text-foreground hover:bg-muted/40" },
    { label: ".", type: "number", className: "bg-card/50 text-foreground hover:bg-muted/40" },
    { label: "=", type: "action", className: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold text-lg" },
  ];

  const handleKeyPress = (label: string, type: string, value?: string) => {
    if (type === "number") {
      if (hasEvaluated) {
        setExpression(label);
        setResult("");
        setHasEvaluated(false);
      } else {
        // Prevent multiple decimals in one number
        if (label === ".") {
          const parts = expression.split(/[\+\-\×\÷\%]/);
          const currentPart = parts[parts.length - 1];
          if (currentPart.includes(".")) return;
        }
        setExpression((prev) => prev + label);
      }
    } else if (type === "operator") {
      setHasEvaluated(false);
      
      // If expression is empty and we type an operator, ignore except minus
      if (!expression) {
        if (label === "-") {
          setExpression("-");
        }
        return;
      }

      // If last char is an operator, replace it
      const lastChar = expression.trim().slice(-1);
      const isOperator = ["+", "-", "×", "÷", "%"].includes(lastChar);
      
      if (isOperator) {
        setExpression((prev) => prev.slice(0, -1) + (value || label));
      } else {
        setExpression((prev) => prev + (value || label));
      }
    } else if (type === "action") {
      if (label === "C") {
        setExpression("");
        setResult("");
        setHasEvaluated(false);
      } else if (label === "⌫") {
        if (hasEvaluated) {
          setExpression("");
          setResult("");
          setHasEvaluated(false);
        } else {
          setExpression((prev) => prev.slice(0, -1));
        }
      } else if (label === "=") {
        evaluateExpression();
      }
    }
  };

  const evaluateExpression = () => {
    if (!expression) return;
    
    // Replace visual operators with math equivalents
    let cleanExpr = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/%/g, "*0.01");

    // Clean any trailing operator
    const lastChar = cleanExpr.trim().slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
      cleanExpr = cleanExpr.slice(0, -1);
    }

    // Sanitize expression
    const sanitized = cleanExpr.replace(/[^\d. +\-*/()]/g, "");

    try {
      // Evaluate equation safely
      const evalFn = new Function(`return (${sanitized})`);
      const rawResult = evalFn();
      
      if (rawResult === undefined || rawResult === null || isNaN(rawResult)) {
        setResult("Error");
        return;
      }

      let formattedResult: string;
      if (!isFinite(rawResult)) {
        formattedResult = "Infinity";
      } else {
        // Limit decimal places to 8, remove trailing zeroes
        const numResult = Number(rawResult);
        formattedResult = Number(numResult.toFixed(8)).toString();
      }
      
      setResult(formattedResult);
      setHasEvaluated(true);
      
      // Log calculator usage
      logCalculatorUsage("normal", formattedResult, expression);
    } catch (e) {
      setResult("Error");
    }
  };

  // Keyboard support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9.]/.test(key)) {
        handleKeyPress(key, "number");
      } else if (key === "+") {
        handleKeyPress("+", "operator");
      } else if (key === "-") {
        handleKeyPress("-", "operator");
      } else if (key === "*") {
        handleKeyPress("×", "operator", "×");
      } else if (key === "/") {
        handleKeyPress("÷", "operator", "÷");
      } else if (key === "%") {
        handleKeyPress("%", "operator", "%");
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleKeyPress("=", "action");
      } else if (key === "Backspace") {
        handleKeyPress("⌫", "action");
      } else if (key === "Escape") {
        handleKeyPress("C", "action");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression, hasEvaluated]);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-base leading-none select-none text-primary font-black" aria-hidden="true">+-</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Standard Calculator</h2>
          <p className="text-xs text-muted-foreground">Perform standard arithmetic calculations</p>
        </div>
      </div>

      {/* Screen Card */}
      <Card className="border border-border bg-card/45 rounded-3xl p-6 flex flex-col justify-end min-h-[120px] text-right gap-1.5 relative shadow-md overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="text-xs font-bold text-muted-foreground tracking-wide uppercase absolute top-4 left-6">
          Display
        </div>
        {/* Expression trace */}
        <div className="text-sm font-semibold text-muted-foreground/60 tracking-normal min-h-[20px] overflow-x-auto whitespace-nowrap hide-scrollbar tabular-nums">
          {expression || "0"}
        </div>
        {/* Main large result/input */}
        <div className="text-3xl sm:text-4xl font-black tracking-tight text-foreground overflow-x-auto whitespace-nowrap hide-scrollbar tabular-nums mt-1">
          {result || expression || "0"}
        </div>
      </Card>

      {/* Keypad Container */}
      <div className="bg-card/25 border border-border/50 rounded-3xl p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              type="button"
              onClick={() => handleKeyPress(btn.label, btn.type, btn.value)}
              className={`h-14 sm:h-16 rounded-2xl border border-border/40 text-base font-bold transition-all active:scale-95 ${btn.className}`}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
