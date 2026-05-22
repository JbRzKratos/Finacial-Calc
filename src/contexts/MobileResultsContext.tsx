
import { createContext, useContext, useMemo, useState, ReactNode } from "react";

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
  const value = useMemo(() => ({ showMobileResults, setShowMobileResults }), [showMobileResults]);
  return (
    <MobileResultsContext.Provider value={value}>
      {children}
    </MobileResultsContext.Provider>
  );
}

export function useMobileResults() {
  return useContext(MobileResultsContext);
}
