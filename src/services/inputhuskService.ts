/**
 * Input Husk Service
 * Handles all input husk-related API calls
 */

import api, { type ApiResponse } from './api';
import type { CreateInputHuskLot, InputHuskLot } from '../utils/types';
import { withSlash } from '../utils/utilFunctions';

// Django REST Framework default pagination response format
export interface InputHuskLotListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: InputHuskLot[];
}


// ============================================
// Input Husk Service
// ============================================

class InputHuskService {
  private basePath = '/coco-husk/husk-lots';

  /**
   * Get all input husk lots
   * @param page - Page number (optional)
   * @param pageSize - Number of items per page (optional)
   * @param search - Search term (optional)
   */
  async getAll(page?: number, pageSize?: number, search?: string): Promise<ApiResponse<InputHuskLotListResponse>> {
    const params: Record<string, string | number> = {};
    if (page !== undefined) params.page = page;
    if (pageSize !== undefined) params.pageSize = pageSize;
    if (search) params.search = search;

    return api.get<InputHuskLotListResponse>(withSlash(this.basePath), { params });
  }

  /**
   * Get a single input husk lot by ID
   * @param id - Supplier ID
   */
  async getById(id: number): Promise<ApiResponse<InputHuskLot>> {
    return api.get<InputHuskLot>(withSlash(`${this.basePath}/${id}`));
  }

  /**
   * Create a new input husk lot
   * @param data - Input husk lot data
   */
  async create(data: CreateInputHuskLot): Promise<ApiResponse<InputHuskLot>> {
    return api.post<InputHuskLot>(withSlash(this.basePath), data);
  }

  /**
   * Update an existing input husk lot
   * @param id - Input husk lot ID
   * @param data - Updated input husk lot data
   */
  async update(id: number, data: Partial<CreateInputHuskLot>): Promise<ApiResponse<InputHuskLot>> {
    return api.put<InputHuskLot>(withSlash(`${this.basePath}/${id}`), data);
  }

  /**
   * Delete a input husk lot
   * @param id - Input husk lot ID
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return api.delete<void>(withSlash(`${this.basePath}/${id}`));
  }
}

// Export singleton instance
export const inputHuskService = new InputHuskService();
export default inputHuskService;

