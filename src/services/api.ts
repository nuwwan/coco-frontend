/**
 * API Service
 * Centralized HTTP client for all API requests
 * Handles authentication, error handling, and request/response interceptors
 */

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

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

// ============================================
// API Service Class
// ============================================

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  /**
   * Gets the default headers for requests
   * Includes auth token if available
   */
  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    });

    // Add auth token if available
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Builds the full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    return url.toString();
  }

  /**
   * Handles the response and error parsing
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Handle unauthorized - token expired or invalid
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw { message: 'Session expired. Please login again.', status: 401 };
    }

    // Parse response body
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      const error: ApiError = {
        message: data?.message || 'An error occurred',
        status: response.status,
        errors: data?.errors,
      };
      throw error;
    }

    return {
      data: data as T,
      message: data?.message,
      success: true,
    };
  }

  /**
   * Makes a fetch request with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw { message: 'Request timeout', status: 408 };
      }
      throw error;
    }
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    customConfig?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const { params, headers: customHeaders, ...restConfig } = customConfig || {};
    
    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders(customHeaders);

    const requestConfig: RequestInit = {
      method,
      headers,
      ...restConfig,
    };

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      requestConfig.body = JSON.stringify(data);
    }

    // Log request in debug mode
    if (config.features.debugMode) {
      console.log(`[API] ${method} ${url}`, data || '');
    }

    try {
      const response = await this.fetchWithTimeout(url, requestConfig);
      const result = await this.handleResponse<T>(response);

      // Log response in debug mode
      if (config.features.debugMode) {
        console.log(`[API] Response:`, result);
      }

      return result;
    } catch (error) {
      // Log error in debug mode
      if (config.features.debugMode) {
        console.error(`[API] Error:`, error);
      }
      throw error;
    }
  }

  // ============================================
  // Public HTTP Methods
  // ============================================

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

// Export singleton instance
export const api = new ApiService();
export default api;

