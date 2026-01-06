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