import { Transaction, MonthlyCashFlow, BudgetCategory } from '../types/finance';

export const mockTransactions: Transaction[] = [
  { id: '1', amount: 5000, category: 'Salary', date: '2026-04-01', description: 'Monthly Salary', type: 'income' },
  { id: '2', amount: 1200, category: 'Housing', date: '2026-04-02', description: 'Rent', type: 'fixed-expense' },
  { id: '3', amount: 150, category: 'Utilities', date: '2026-04-05', description: 'Electric Bill', type: 'fixed-expense' },
  { id: '4', amount: 80, category: 'Food', date: '2026-04-06', description: 'Groceries', type: 'variable-expense' },
  { id: '5', amount: 60, category: 'Entertainment', date: '2026-04-10', description: 'Movie night', type: 'variable-expense' },
  { id: '6', amount: 200, category: 'Transport', date: '2026-04-12', description: 'Gas and Transit', type: 'variable-expense' }
];

export const mockCategories: BudgetCategory[] = [
  { name: 'Housing', allocated: 1200, spent: 1200, color: '#3b82f6' },
  { name: 'Food', allocated: 400, spent: 80, color: '#f59e0b' },
  { name: 'Transport', allocated: 250, spent: 200, color: '#10b981' },
  { name: 'Utilities', allocated: 200, spent: 150, color: '#8b5cf6' },
  { name: 'Entertainment', allocated: 150, spent: 60, color: '#ec4899' }
];

export const mockCashFlow: MonthlyCashFlow[] = [
  { month: 'Jan', income: 5000, fixedExpenses: 1500, variableExpenses: 1200 },
  { month: 'Feb', income: 5000, fixedExpenses: 1500, variableExpenses: 1100 },
  { month: 'Mar', income: 5200, fixedExpenses: 1500, variableExpenses: 1400 },
  { month: 'Apr', income: 5000, fixedExpenses: 1500, variableExpenses: 800 }
];

export const mockNetWorth = 45200;
