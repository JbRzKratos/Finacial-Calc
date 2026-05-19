import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Tracker — FinCalc Pro",
  description: "Track your monthly spending and manage budgets",
};

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
