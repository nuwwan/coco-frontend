/**
 * Expense Service
 * Handles all expense-related API calls
*/

import api, { type ApiResponse } from './api';
import type { DashboardStats, Expense } from '../utils/types';
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
  private basePath = '/dashboard';

  /**
   * Get all expenses
   * @param year - Year (optional)
   * @param month - Month (optional)
   * @param day - Day (optional)
   */
  async getDashboardStats(year?: number, month?: number): Promise<ApiResponse<DashboardStats>> {
    const params: Record<string, number> = {};
    const url=`${this.basePath}/statistics`;
    if (year !== undefined) params.year = year;
    if (month !== undefined) params.month = month;

    return api.get<DashboardStats>(withSlash(url), { params });
  }

}

// Export singleton instance
export const expenseService = new ExpenseService();
export default expenseService;

