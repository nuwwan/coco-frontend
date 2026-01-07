/**
 * Employee Service
 * Handles all employee-related API calls
 */

import api, { type ApiResponse } from './api';
import type { Employee, EmployeebasicDetails } from '../utils/types';
import { withSlash } from '../utils/utilFunctions';

// ============================================
// Types & Interfaces
// ============================================

export interface CreateEmployeeData {
  userId: number; // Required: ID of the auth user to link
  gender: string;
  birthDate: string;
  address: string;
  contactNumber: string;
  position: string;
  hourlyRate: number;
  joinedDate: string;
  resignedDate: string;
  description: string;
  isActive: boolean;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
  id: number;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================
// Employee Service
// ============================================

class EmployeeService {
  // Base path with trailing slash for Django
  private basePath = '/master-data/employees';

  /**
   * Get all employees
   * @param page - Page number (optional)
   * @param pageSize - Number of items per page (optional)
   * @param search - Search term (optional)
   */
  async getAll(page?: number, pageSize?: number, search?: string): Promise<ApiResponse<EmployeeListResponse>> {
    const params: Record<string, string | number> = {};
    if (page !== undefined) params.page = page;
    if (pageSize !== undefined) params.pageSize = pageSize;
    if (search) params.search = search;

    return api.get<EmployeeListResponse>(withSlash(this.basePath), { params });
  }

  /**
   * Get a single employee by ID
   * @param id - Employee ID
   */
  async getById(id: number): Promise<ApiResponse<Employee>> {
    return api.get<Employee>(withSlash(`${this.basePath}/${id}`));
  }

  /**
   * Create a new employee
   * @param data - Employee data
   */
  async create(data: CreateEmployeeData): Promise<ApiResponse<Employee>> {
    return api.post<Employee>(withSlash(this.basePath), data);
  }

  /**
   * Update an existing employee
   * @param id - Employee ID
   * @param data - Updated employee data
   */
  async update(id: number, data: Partial<CreateEmployeeData>): Promise<ApiResponse<Employee>> {
    return api.put<Employee>(withSlash(`${this.basePath}/${id}`), data);
  }

  /**
   * Delete an employee
   * @param id - Employee ID
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return api.delete<void>(withSlash(`${this.basePath}/${id}`));
  }

  /**
   * Get employees by department
   * @param department - Department name
   */
  async getByDepartment(department: string): Promise<ApiResponse<Employee[]>> {
    return api.get<Employee[]>(withSlash(`${this.basePath}/department/${department}`));
  }

  /**
   * Update employee status
   * @param id - Employee ID
   * @param status - New status
   */
  async updateStatus(id: number, status: 'active' | 'inactive'): Promise<ApiResponse<Employee>> {
    return api.patch<Employee>(withSlash(`${this.basePath}/${id}/status`), { status });
  }

  /**
   * Search employees by name, position, or contact
   * @param query - Search query string
   */
  async search(query: string): Promise<ApiResponse<EmployeebasicDetails[]>> {
    const url = withSlash(`${this.basePath}/search_employee_basic_details`);
    return api.get<EmployeebasicDetails[]>(url, { params: { search: query } });
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();
export default employeeService;
