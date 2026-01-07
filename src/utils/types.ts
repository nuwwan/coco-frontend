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