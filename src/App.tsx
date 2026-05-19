import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SIPPage from "@/features/finance-calc/pages/sip";
import EMIPage from "@/features/finance-calc/pages/emi";
import FDPage from "@/features/finance-calc/pages/fd";
import CAGRPage from "@/features/finance-calc/pages/cagr";
import RetirementPage from "@/features/finance-calc/pages/retirement";
import TaxPage from "@/features/finance-calc/pages/tax";
import LoanVsInvestPage from "@/features/finance-calc/pages/loan-vs-invest";

import HomePage from "@app/page";
import BudgetDashboard from "@app/budget/page";
import AddPage from "@app/budget/add/page";
import CategoriesPage from "@app/budget/categories/page";
import ReportsPage from "@app/budget/reports/page";
import TransactionsPage from "@app/budget/transactions/page";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculator" element={<Navigate to="/calculator/sip" replace />} />
        <Route path="/calculator/sip" element={<SIPPage />} />
        <Route path="/calculator/emi" element={<EMIPage />} />
        <Route path="/calculator/fd" element={<FDPage />} />
        <Route path="/calculator/cagr" element={<CAGRPage />} />
        <Route path="/calculator/retirement" element={<RetirementPage />} />
        <Route path="/calculator/tax" element={<TaxPage />} />
        <Route path="/calculator/loanvsinvest" element={<LoanVsInvestPage />} />
        <Route path="/budget" element={<BudgetDashboard />} />
        <Route path="/budget/add" element={<AddPage />} />
        <Route path="/budget/categories" element={<CategoriesPage />} />
        <Route path="/budget/reports" element={<ReportsPage />} />
        <Route path="/budget/transactions" element={<TransactionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
