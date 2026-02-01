export type Expense = {
  id: string;
  amount: number; 
  category: string;
  description: string;
  date: string; // ISO string
  createdAt?: string;
  updatedAt?: string;
};

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];