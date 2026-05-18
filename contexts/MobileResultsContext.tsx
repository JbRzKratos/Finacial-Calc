"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface MobileResultsContextType {
  showMobileResults: boolean;
  setShowMobileResults: (v: boolean) => void;
}

const MobileResultsContext = createContext<MobileResultsContextType>({
  showMobileResults: false,
  setShowMobileResults: () => {},
});

export function MobileResultsProvider({ children }: { children: ReactNode }) {
  const [showMobileResults, setShowMobileResults] = useState(false);

  useEffect(() => {
    if (showMobileResults) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showMobileResults]);

  return (
    <MobileResultsContext.Provider value={{ showMobileResults, setShowMobileResults }}>
      {children}
    </MobileResultsContext.Provider>
  );
}

export function useMobileResults() {
  return useContext(MobileResultsContext);
}
