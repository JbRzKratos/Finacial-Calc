import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "@/pages/Home";

const BudgetPage = lazy(() => import("@/components/budget/BudgetPage"));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Dashboard Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/calculator/:calcId" element={<Home />} />
        <Route
          path="/budget"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-muted-foreground text-sm">Loading...</div>}>
              <BudgetPage />
            </Suspense>
          }
        />

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
