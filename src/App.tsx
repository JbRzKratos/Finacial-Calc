import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SIPPage from "@/components/calculators/SIPCalculator/SIPCalculator";
import EMIPage from "@/components/calculators/LoanCalculator/LoanCalculator";
import FDPage from "@/components/calculators/FDCalculator/FDCalculator";
import CAGRPage from "@/components/calculators/CAGRCalculator/CAGRCalculator";
import RetirementPage from "@/components/calculators/RetirementCalculator/RetirementCalculator";
import TaxPage from "@/components/calculators/TaxCalculator/TaxCalculator";
import LoanVsInvestPage from "@/components/calculators/MutualFundCalculator/MutualFundCalculator";

import HomePage from "@/screens/HomeScreen/page";
import BudgetDashboard from "@/screens/BudgetScreen/page";
import AddPage from "@/screens/BudgetScreen/add/page";
import CategoriesPage from "@/screens/BudgetScreen/categories/page";
import ReportsPage from "@/screens/BudgetScreen/reports/page";
import TransactionsPage from "@/screens/BudgetScreen/transactions/page";

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
