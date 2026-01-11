/**
 * Output Order Service
 * Handles all output order-related API calls
 */

import api, { type ApiResponse } from './api';
import type { CreateOutputOrder, OutputOrder } from '../utils/types';
import { withSlash } from '../utils/utilFunctions';

// Django REST Framework default pagination response format
export interface OutputOrderListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: OutputOrder[];
}


// ============================================
// Output Order Service
// ============================================

class OutputOrderService {
    private basePath = '/coco-husk/chip-order';

    /**
     * Get all output orders
     * @param page - Page number (optional)
     * @param pageSize - Number of items per page (optional)
     * @param search - Search term (optional)
     */
    async getAll(page?: number, pageSize?: number, search?: string): Promise<ApiResponse<OutputOrderListResponse>> {
        const params: Record<string, string | number> = {};
        if (page !== undefined) params.page = page;
        if (pageSize !== undefined) params.pageSize = pageSize;
        if (search) params.search = search;

        return api.get<OutputOrderListResponse>(withSlash(this.basePath), { params });
    }

    /**
     * Get a single output order by ID
     * @param id - Supplier ID
     */
    async getById(id: number): Promise<ApiResponse<OutputOrder>> {
        return api.get<OutputOrder>(withSlash(`${this.basePath}/${id}`));
    }

    /**
     * Create a new output order
     * @param data - Output order data
     */
    async create(data: CreateOutputOrder): Promise<ApiResponse<OutputOrder>> {
        return api.post<OutputOrder>(withSlash(this.basePath), data);
    }

    /**
     * Update an existing output order
     * @param id - Output order ID
     * @param data - Updated output order data
     */
    async update(id: number, data: Partial<CreateOutputOrder>): Promise<ApiResponse<OutputOrder>> {
        return api.put<OutputOrder>(withSlash(`${this.basePath}/${id}`), data);
    }

    /**
     * Delete a output order
     * @param id - Output order ID
     */
    async delete(id: number): Promise<ApiResponse<void>> {
        return api.delete<void>(withSlash(`${this.basePath}/${id}`));
    }
}

// Export singleton instance
export const outputOrderService = new OutputOrderService();
export default outputOrderService;

