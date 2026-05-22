import * as React from "react";

interface AnimatedNumberProps {
  value: number;
  formatter?: (val: number) => string;
  duration?: number;
}

export function AnimatedNumber({ value, formatter = (v) => String(Math.round(v)), duration = 350 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const startValueRef = React.useRef(value);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const startTime = performance.now();
    const startValue = startValueRef.current;
    const endValue = value;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * ease;
      
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        startValueRef.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return <>{formatter(displayValue)}</>;
}
