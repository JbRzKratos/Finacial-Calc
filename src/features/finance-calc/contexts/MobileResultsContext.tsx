"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MobileResultsContextType {
  showMobileResults: boolean;
  setShowMobileResults: (show: boolean) => void;
}

const MobileResultsContext = createContext<MobileResultsContextType>({
  showMobileResults: false,
  setShowMobileResults: () => {},
});

export function MobileResultsProvider({ children }: { children: ReactNode }) {
  const [showMobileResults, setShowMobileResults] = useState(false);
  return (
    <MobileResultsContext.Provider value={{ showMobileResults, setShowMobileResults }}>
      {children}
    </MobileResultsContext.Provider>
  );
}

export function useMobileResults() {
  return useContext(MobileResultsContext);
}
