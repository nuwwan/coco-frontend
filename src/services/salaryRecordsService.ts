import type { EmployeeRecordForPeriodResponse, SalaryPayment, SalaryTerm } from "../utils/types";
import { withSlash } from "../utils/utilFunctions";
import api, { type ApiResponse } from './api';

export interface SalaryPaymentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: SalaryPayment[];
}

export interface SalaryTermListResponse {
    results: SalaryTerm[];
}

export interface CreateSalaryRecordData {
    user: number;
    salaryTerm: number;
    salary: string;
    remarks: string;
}

export interface CreateSalaryRecordResponse {
    results: SalaryPayment;
}

class SalaryRecordsService {
    private basePath = '/business-costs/salary-records';
    private salaryTermPath = '/business-costs/salary-terms';
    private employeeRecordsPath = '/business-costs/employee-records';

    /**
     * Get all salary records
     */
    async getAll(): Promise<ApiResponse<SalaryPaymentListResponse>> {
        const url: string = `${this.basePath}/get-all`;
        return api.get<SalaryPaymentListResponse>(withSlash(url));
    }

    /**
     * Get salary record by ID
     */
    async getById(id: number): Promise<ApiResponse<SalaryPayment>> {
        return api.get<SalaryPayment>(withSlash(`${this.basePath}/${id}`));
    }

    /**
     * Create a new salary record
     */
    async create(salaryPayment: CreateSalaryRecordData): Promise<ApiResponse<CreateSalaryRecordResponse>> {
        const url: string = `${this.basePath}/create`;
        return api.post<CreateSalaryRecordResponse>(withSlash(url), salaryPayment);
    }

    /**
     * Get all salary terms for dropdown
     */
    async getSalaryTerms(): Promise<ApiResponse<SalaryTermListResponse>> {
        const url: string = `${this.salaryTermPath}/get-all`;
        return api.get<SalaryTermListResponse>(withSlash(url));
    }

    /**
     * Delete a salary record
     */
    async delete(id: number): Promise<ApiResponse<void>> {
        const url: string = `${this.basePath}/delete/${id}`;
        return api.delete<void>(withSlash(url));
    }

    /**
     * Get employee records for a specific period and employee
     */
    async getEmployeeRecordsForPeriod(
        userId: number,
        salaryTermId: number
    ): Promise<ApiResponse<EmployeeRecordForPeriodResponse>> {
        const url: string = `${this.employeeRecordsPath}/get-for-period`;
        return api.get<EmployeeRecordForPeriodResponse>(withSlash(url), {
            params: { user: userId, 'salary-term-id': salaryTermId }
        });
    }
}

export const salaryRecordsService = new SalaryRecordsService();
export default salaryRecordsService;