import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Expense } from '../types/expense';
import { api, CreateExpenseDTO } from '../lib/api';

export function useExpenses(category?: string, sort?: string) {
  return useQuery({
    queryKey: ['expenses', category, sort],
    queryFn: async () => {
      const response = await api.getExpenses({ 
        category, 
        sort: sort || 'date_desc' 
      });
      
      return {
        expenses: response.data.map(item => ({
          id: item._id,
          amount: item.amount,
          category: item.category,
          description: item.description,
          date: item.date,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })) as Expense[],
        total: response.total,
        count: response.count,
      };
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpenseDTO) => {
      return api.createExpense(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.deleteExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}