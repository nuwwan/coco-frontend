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