/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api, { type ApiResponse } from './api';

// ============================================
// Types & Interfaces
// ============================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  userId: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ============================================
// Auth Service
// ============================================

class AuthService {
  /**
   * Login user with credentials
   * @param credentials - userId and password
   * @returns AuthResponse with token and user data
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>('/auth/login', credentials);
  }

  /**
   * Register new user
   * @param data - Registration data
   * @returns AuthResponse with token and user data
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>('/auth/register', data);
  }

  /**
   * Logout user (optional server-side logout)
   */
  async logout(): Promise<ApiResponse<void>> {
    return api.post<void>('/auth/logout');
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return api.get<User>('/auth/profile');
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return api.post<{ token: string }>('/auth/refresh');
  }

  /**
   * Request password reset
   * @param email - User's email address
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return api.post<void>('/auth/forgot-password', { email });
  }

  /**
   * Reset password with token
   * @param token - Reset token from email
   * @param newPassword - New password
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return api.post<void>('/auth/reset-password', { token, newPassword });
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;

