/**
 * Expense Service
 * Handles all expense-related API calls
*/

import api, { type ApiResponse } from './api';
import type { Expense } from '../utils/types';
import { withSlash } from '../utils/utilFunctions';

// ============================================
// Types & Interfaces
// ============================================

export interface CreateExpenseData {
  title: string;
  expenseType: string;
  year: number;
  month: number;
  day: number;
  cost: string;
  status: string;
  remarks: string;
}

// Django REST Framework default pagination response format
export interface ExpenseListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Expense[];
}

// ============================================
// Expense Service
// ============================================

class ExpenseService {
  private basePath = '/business-costs/expenses';

  /**
   * Get all expenses
   * @param year - Year (optional)
   * @param month - Month (optional)
   * @param day - Day (optional)
   */
  async getAll(year?: number, month?: number, day?: number): Promise<ApiResponse<ExpenseListResponse>> {
    const params: Record<string, number> = {};
    if (year !== undefined) params.year = year;
    if (month !== undefined) params.month = month;
    if (day !== undefined) params.day = day;

    return api.get<ExpenseListResponse>(withSlash(this.basePath), { params });
  }

  /**
   * Get a single expense by ID
   * @param id - Expense ID
   */
  async getById(id: number): Promise<ApiResponse<Expense>> {
    return api.get<Expense>(withSlash(`${this.basePath}/${id}`));
  }

  /**
   * Create a new expense
   * @param data - Expense data
   */
  async create(data: CreateExpenseData): Promise<ApiResponse<Expense>> {
    return api.post<Expense>(withSlash(this.basePath), data);
  }

  /**
   * Update an existing expense
   * @param id - Expense ID
   * @param data - Updated expense data
   */
  async update(id: number, data: Partial<CreateExpenseData>): Promise<ApiResponse<Expense>> {
    return api.put<Expense>(withSlash(`${this.basePath}/${id}`), data);
  }

  /**
   * Delete a expense
   * @param id - Expense ID
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return api.delete<void>(withSlash(`${this.basePath}/${id}`));
  }
}

// Export singleton instance
export const expenseService = new ExpenseService();
export default expenseService;

