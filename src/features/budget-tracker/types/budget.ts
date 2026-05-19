export interface Transaction {
  id: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export type TabId = "dashboard" | "add" | "history" | "reports" | "settings";

export interface FinanceState {
  transactions: Transaction[];
}

export type FinanceAction =
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "LOAD_DATA"; payload: Transaction[] }
  | { type: "RESET" };
