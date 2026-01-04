/**
 * Supplier Service
 * Handles all supplier-related API calls
 * 
 * Note: All endpoints use trailing slashes for Django compatibility
 */

import api, { type ApiResponse } from './api';
import type { Buyer, Supplier } from '../utils/types';

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
// Supplier Service
// ============================================

class BuyerService {
  private basePath = '/master-data/buyers';

  /**
   * Ensures URL has trailing slash for Django compatibility
   */
  private withSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
  }

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

    return api.get<BuyerListResponse>(this.withSlash(this.basePath), { params });
  }

  /**
   * Get a single buyer by ID
   * @param id - Buyer ID
   */
  async getById(id: number): Promise<ApiResponse<Buyer>> {
    return api.get<Buyer>(this.withSlash(`${this.basePath}/${id}`));
  }

  /**
   * Create a new buyer
   * @param data - Buyer data
   */
  async create(data: CreateBuyerData): Promise<ApiResponse<Buyer>> {
    return api.post<Buyer>(this.withSlash(this.basePath), data);
  }

  /**
   * Update an existing buyer
   * @param id - Buyer ID
   * @param data - Updated buyer data
   */
  async update(id: number, data: Partial<CreateBuyerData>): Promise<ApiResponse<Buyer>> {
    return api.put<Buyer>(this.withSlash(`${this.basePath}/${id}`), data);
  }

  /**
   * Delete a buyer
   * @param id - Supplier ID
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return api.delete<void>(this.withSlash(`${this.basePath}/${id}`));
  }
}

// Export singleton instance
export const buyerService = new BuyerService();
export default buyerService;

