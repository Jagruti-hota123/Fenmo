const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generate a unique idempotency key
const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
};

export type CreateExpenseDTO = {
  amount: number;
  category: string;
  description: string;
  date: string;
};

export type ExpenseResponse = {
  success: boolean;
  count: number;
  total: number;
  data: Array<{
    _id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type SingleExpenseResponse = {
  success: boolean;
  data: {
    _id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
  };
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details?.[0] || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getExpenses(filters: { category?: string; sort?: string } = {}): Promise<ExpenseResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.category && filters.category !== 'ALL') {
      queryParams.append('category', filters.category);
    }
    
    if (filters.sort) {
      queryParams.append('sort', filters.sort);
    }

    const query = queryParams.toString();
    const endpoint = query ? `/expenses?${query}` : '/expenses';
    
    return this.request<ExpenseResponse>(endpoint);
  }

 async createExpense(expenseData: CreateExpenseDTO): Promise<SingleExpenseResponse> {
    const idempotencyKey = generateIdempotencyKey();
    
    console.log('=== FRONTEND API CALL ===');
    console.log('1. Data received:', expenseData);
    console.log('2. JSON stringified:', JSON.stringify(expenseData));
    console.log('3. URL:', `${this.baseUrl}/expenses`);
    console.log('4. Headers:', {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    });
    
    const response = await fetch(`${this.baseUrl}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(expenseData),
    });
    
    console.log('5. Response status:', response.status);
    const data = await response.json();
    console.log('6. Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || data.details?.[0] || 'Something went wrong');
    }

    return data;
  }

  async deleteExpense(id: string): Promise<SingleExpenseResponse> {
    return this.request<SingleExpenseResponse>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getSummary() {
    return this.request('/expenses/summary/by-category');
  }
}

export const api = new ApiClient(API_BASE_URL);