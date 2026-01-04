/**
 * Supplier Service
 * Handles all supplier-related API calls
 * 
 * Note: All endpoints use trailing slashes for Django compatibility
 */

import api, { type ApiResponse } from './api';
import type { Supplier } from '../utils/types';

// ============================================
// Types & Interfaces
// ============================================

export interface CreateSupplierData {
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  description: string;
}

// Django REST Framework default pagination response format
export interface SupplierListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Supplier[];
}

// ============================================
// Supplier Service
// ============================================

class SupplierService {
  private basePath = '/master-data/suppliers';

  /**
   * Ensures URL has trailing slash for Django compatibility
   */
  private withSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
  }

  /**
   * Get all suppliers
   * @param page - Page number (optional)
   * @param pageSize - Number of items per page (optional)
   * @param search - Search term (optional)
   */
  async getAll(page?: number, pageSize?: number, search?: string): Promise<ApiResponse<SupplierListResponse>> {
    const params: Record<string, string | number> = {};
    if (page !== undefined) params.page = page;
    if (pageSize !== undefined) params.pageSize = pageSize;
    if (search) params.search = search;

    return api.get<SupplierListResponse>(this.withSlash(this.basePath), { params });
  }

  /**
   * Get a single supplier by ID
   * @param id - Supplier ID
   */
  async getById(id: number): Promise<ApiResponse<Supplier>> {
    return api.get<Supplier>(this.withSlash(`${this.basePath}/${id}`));
  }

  /**
   * Create a new supplier
   * @param data - Supplier data
   */
  async create(data: CreateSupplierData): Promise<ApiResponse<Supplier>> {
    return api.post<Supplier>(this.withSlash(this.basePath), data);
  }

  /**
   * Update an existing supplier
   * @param id - Supplier ID
   * @param data - Updated supplier data
   */
  async update(id: number, data: Partial<CreateSupplierData>): Promise<ApiResponse<Supplier>> {
    return api.put<Supplier>(this.withSlash(`${this.basePath}/${id}`), data);
  }

  /**
   * Delete a supplier
   * @param id - Supplier ID
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return api.delete<void>(this.withSlash(`${this.basePath}/${id}`));
  }
}

// Export singleton instance
export const supplierService = new SupplierService();
export default supplierService;

