import type { EmployeeRecord } from "../utils/types";
import { withSlash } from "../utils/utilFunctions";
import api, { type ApiResponse } from './api';

export interface EmployeeRecordListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: EmployeeRecord[];
}

export interface CreateEmployeeRecordData {
    user: number;
    year: number;
    month: number;
    day: number;
    hours: string;
    otHours: string;
    remarks: string;
}

class EmployeeRecordsService {
    private basePath = '/business-costs/employee-records';

    async getAll(page?: number, pageSize?: number, search?: string): Promise<ApiResponse<EmployeeRecordListResponse>> {
        const params: Record<string, string | number> = {};
        if (page !== undefined) params.page = page;
        if (pageSize !== undefined) params.pageSize = pageSize;
        if (search) params.search = search;

        return api.get<EmployeeRecordListResponse>(withSlash(this.basePath), { params });
    }

    async getById(id: number): Promise<ApiResponse<EmployeeRecord>> {
        return api.get<EmployeeRecord>(withSlash(`${this.basePath}/${id}`));
    }

    async create(employeeRecord: CreateEmployeeRecordData): Promise<ApiResponse<EmployeeRecord>> {
        return api.post<EmployeeRecord>(withSlash(this.basePath), employeeRecord);
    }

    async update(id: number, employeeRecord: Partial<CreateEmployeeRecordData>): Promise<ApiResponse<EmployeeRecord>> {
        return api.put<EmployeeRecord>(withSlash(`${this.basePath}/${id}`), employeeRecord);
    }

    async delete(id: number): Promise<ApiResponse<void>> {
        return api.delete<void>(withSlash(`${this.basePath}/${id}`));
    }
}

export const employeeRecordsService = new EmployeeRecordsService();
export default employeeRecordsService;