/**
 * API Service
 * Centralized HTTP client for all API requests using Axios
 * Handles authentication, error handling, and request/response interceptors
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { config } from '../config/env';
import { getToken, removeToken } from '../utils/jwt';

// ============================================
// Types & Interfaces
// ============================================

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

interface RequestConfig {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

// ============================================
// API Service Class
// ============================================

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.axiosInstance.interceptors.request.use(
      (requestConfig) => {
        const token = getToken();
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in debug mode
        if (config.features.debugMode) {
          console.log(`[API] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`, requestConfig.data || '');
        }

        return requestConfig;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log response in debug mode
        if (config.features.debugMode) {
          console.log(`[API] Response:`, response.data);
        }
        return response;
      },
      (error: AxiosError) => {
        // Handle unauthorized - token expired or invalid
        if (error.response?.status === 401) {
          removeToken();
          window.location.href = '/login';
        }

        // Log error in debug mode
        if (config.features.debugMode) {
          console.error(`[API] Error:`, error);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Handles the response and formats it
   */
  private handleResponse<T>(data: T): ApiResponse<T> {
    return {
      data,
      success: true,
    };
  }

  /**
   * Handles errors and formats them
   */
  private handleError(error: AxiosError): never {
    const apiError: ApiError = {
      message: (error.response?.data as { message?: string })?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      errors: (error.response?.data as { errors?: Record<string, string[]> })?.errors,
    };
    throw apiError;
  }

  // ============================================
  // Public HTTP Methods
  // ============================================

  /**
   * GET request
   */
  async get<T>(endpoint: string, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        params: requestConfig?.params,
        headers: requestConfig?.headers,
      };
      const response = await this.axiosInstance.get<T>(endpoint, axiosConfig);
      return this.handleResponse(response.data);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        params: requestConfig?.params,
        headers: requestConfig?.headers,
      };
      const response = await this.axiosInstance.post<T>(endpoint, data, axiosConfig);
      return this.handleResponse(response.data);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        params: requestConfig?.params,
        headers: requestConfig?.headers,
      };
      const response = await this.axiosInstance.put<T>(endpoint, data, axiosConfig);
      return this.handleResponse(response.data);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        params: requestConfig?.params,
        headers: requestConfig?.headers,
      };
      const response = await this.axiosInstance.patch<T>(endpoint, data, axiosConfig);
      return this.handleResponse(response.data);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requestConfig?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        params: requestConfig?.params,
        headers: requestConfig?.headers,
      };
      const response = await this.axiosInstance.delete<T>(endpoint, axiosConfig);
      return this.handleResponse(response.data);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }
}

// Export singleton instance
export const api = new ApiService();
export default api;
