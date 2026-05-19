"use client";

import { useEffect, useState } from "react";

let toastListener: ((msg: string) => void) | null = null;

export function showToast(message: string) {
  toastListener?.(message);
}

export function Toast() {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    toastListener = (msg: string) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 2200);
    };
    return () => { toastListener = null; };
  }, []);

  return (
    <div className={ "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 " +
      (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")
    }>
      <div className="bg-card text-card-foreground px-4 py-2.5 rounded-xl shadow-lg border text-sm font-medium backdrop-blur-sm whitespace-nowrap">
        {message}
      </div>
    </div>
  );
}
