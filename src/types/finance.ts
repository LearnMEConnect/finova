export type TransactionType = 'income' | 'fixed-expense' | 'variable-expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type?: TransactionType;
  goalId?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
}

export interface Liability {
  id: string;
  name: string;
  type: string;
  value: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  deadlineDate: string;
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
