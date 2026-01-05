/**
 * Buyer Service
 * Handles all buyer-related API calls
*/

import api, { type ApiResponse } from './api';
import type { Buyer } from '../utils/types';
import { withSlash } from '../utils/utilFunctions';

// ============================================
// Types & Interfaces
// ============================================

export interface CreateBuyerData {
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  description: string;
}

// Django REST Framework default pagination response format
export interface BuyerListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Buyer[];
}

// ============================================
// Buyer Service
// ============================================

class BuyerService {
  private basePath = '/master-data/buyers';

  /**
   * Get all buyers
   * @param page - Page number (optional)
   * @param pageSize - Number of items per page (optional)
   * @param search - Search term (optional)
   */
  async getAll(page?: number, pageSize?: number, search?: string): Promise<ApiResponse<BuyerListResponse>> {
    const params: Record<string, string | number> = {};
    if (page !== undefined) params.page = page;
    if (pageSize !== undefined) params.pageSize = pageSize;
    if (search) params.search = search;

    return api.get<BuyerListResponse>(withSlash(this.basePath), { params });
  }

  /**
   * Get a single buyer by ID
   * @param id - Buyer ID
   */
  async getById(id: number): Promise<ApiResponse<Buyer>> {
    return api.get<Buyer>(withSlash(`${this.basePath}/${id}`));
  }

  /**
   * Create a new buyer
   * @param data - Buyer data
   */
  async create(data: CreateBuyerData): Promise<ApiResponse<Buyer>> {
    return api.post<Buyer>(withSlash(this.basePath), data);
  }

  /**
   * Update an existing buyer
   * @param id - Buyer ID
   * @param data - Updated buyer data
   */
  async update(id: number, data: Partial<CreateBuyerData>): Promise<ApiResponse<Buyer>> {
    return api.put<Buyer>(withSlash(`${this.basePath}/${id}`), data);
  }

  /**
   * Delete a buyer
   * @param id - Buyer ID
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return api.delete<void>(withSlash(`${this.basePath}/${id}`));
  }
}

// Export singleton instance
export const buyerService = new BuyerService();
export default buyerService;

