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
    startDate: string;
    endDate: string;
    remarks: string;
}

export interface SalaryPaymentStats {
    totalPaid: number;
    totalPending: number;
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

    async getSalarypaymentsStats(year: number, month: number): Promise<ApiResponse<SalaryPaymentStats>> {
        const params: Record<string, string | number> = {};
        if (year !== undefined) params.year = year;
        if (month !== undefined) params.month = month;
        const url:string = withSlash(`${this.basePath}/stats`);
        return api.get<SalaryPaymentStats>(url, { params });
    }
}

export const salaryPaymentService = new SalaryPaymentService();
export default salaryPaymentService;