export interface User {
    id: number;
    firstName: string;
    username: string;
    lastName: string;
    email: string;
    isActive: boolean;
}

export type Gender = 'Male' | 'Female' | 'Other';

export interface Employee {
    user: User;
    address: string;
    birthDate: string | null;
    contactNumber: string;
    createdAt?: string;
    description: string;
    gender: Gender;
    hourlyRate: number;
    id?: number;
    isActive: boolean;
    joinedDate: string | null;
    position: string;
    resignedDate?: string | null;
    updatedAt?: string;
}

export interface Supplier {
    id?: number;
    name: string;
    address: string;
    contactNumber: string;
    email: string;
    description: string;
    createdAt?: string;  // readonly
    updatedAt?: string;  // readonly
}

export interface Buyer {
    id?: number;
    name: string;
    address: string;
    contactNumber: string;
    email: string;
    description: string;
    createdAt?: string;  // readonly
    updatedAt?: string;  // readonly
}

export interface EmployeebasicDetails {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    position: string;
    contactNumber: string;
}

export interface EmployeeRecord {
    id?: number;
    user: number;
    year: number;
    month: number;
    day: number;
    hours: string;
    otHours: string;
    remarks: string;
    createdAt?: string;  // readonly
    updatedAt?: string;  // readonly
    createdBy: number;
}

export interface InputHuskLot {
    id?: number;
    supplier: number;
    dateReceived: string;
    quantity: number;
    quality: string;
    unitPrice: string;
    discount: string;
    transportCost: string;
    loadUnloadCost: string;
    otherCosts: string;
    grossCost: string;
    netCost: string;
    remarks: string;
    createdBy: number;
    createdAt: string;
}

export interface CreateInputHuskLot {
    supplier: number;
    dateReceived: string;
    quantity: number;
    quality: string;
    unitPrice: string;
    discount: string;
    transportCost: string;
    loadUnloadCost: string;
    otherCosts: string;
    remarks: string;
}

export interface Expense {
    id?: number;
    title: string;
    expenseType: string;
    year: number;
    month: number;
    day: number;
    cost: string;
    status: string;
    remarks: string;
    createdAt?: string;  // readonly
    updatedAt?: string;  // readonly
    createdBy: number;
}

/**
 * Represents the summary statistics for the dashboard as of 2026.
 */
export interface DashboardStats {
    total_employees: number;
    total_suppliers: number;
    total_buyers: number;
    last_12_months_summary: Last12MonthsSummary;
  }
  
  /**
   * Monthly data containers. 
   * The keys are date strings (YYYY-M-D) and values are numerical metrics.
   */
  export interface Last12MonthsSummary {
    total_input_husk_quantity: MonthlyData;
    total_input_husk_costs: MonthlyData;
    total_expenses: MonthlyData;
    total_employee_hours: MonthlyData;
  }
  
  /**
   * A utility type for dynamic date-based keys.
   * Example: { "2025-12-1": 3000, "2026-1-1": 900 }
   */
  export type MonthlyData = Record<string, number>;