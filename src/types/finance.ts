export type TransactionType = 'income' | 'fixed-expense' | 'variable-expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: TransactionType;
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

export interface MonthlyCashFlow {
  month: string;
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
}
