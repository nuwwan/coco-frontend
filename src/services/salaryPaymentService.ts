import type { SalaryPayment } from "../utils/types";
import { withSlash } from "../utils/utilFunctions";
import api, { type ApiResponse } from './api';

export interface SalaryPaymentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: SalaryPayment[];
}

export interface CreateSalaryPaymentData {
    user: number;
    day: number;
    month: number;
    year: number;
    salary: string;
    remarks: string;
}

class SalaryPaymentService {
    private basePath = '/business-costs/salary-payments';

    async getAll(page?: number, pageSize?: number, search?: string): Promise<ApiResponse<SalaryPaymentListResponse>> {
        const params: Record<string, string | number> = {};
        if (page !== undefined) params.page = page;
        if (pageSize !== undefined) params.pageSize = pageSize;
        if (search) params.search = search;

        return api.get<SalaryPaymentListResponse>(withSlash(this.basePath), { params });
    }

    async getById(id: number): Promise<ApiResponse<SalaryPayment>> {
        return api.get<SalaryPayment>(withSlash(`${this.basePath}/${id}`));
    }

    async create(salaryPayment: CreateSalaryPaymentData): Promise<ApiResponse<SalaryPayment>> {
        return api.post<SalaryPayment>(withSlash(this.basePath), salaryPayment);
    }

    async update(id: number, salaryPayment: Partial<CreateSalaryPaymentData>): Promise<ApiResponse<SalaryPayment>> {
        return api.put<SalaryPayment>(withSlash(`${this.basePath}/${id}`), salaryPayment);
    }

    async delete(id: number): Promise<ApiResponse<void>> {
        return api.delete<void>(withSlash(`${this.basePath}/${id}`));
    }
}

export const salaryPaymentService = new SalaryPaymentService();
export default salaryPaymentService;