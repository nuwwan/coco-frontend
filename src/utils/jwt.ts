/**
 * JWT Utility Functions
 * Handles token storage, retrieval, and validation
 */

import { config } from '../config/env';

// Use token key from environment config
const TOKEN_KEY = config.auth.tokenKey;

/**
 * Stores the JWT token in localStorage
 * @param token - The JWT token to store
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieves the JWT token from localStorage
 * @returns The stored token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Removes the JWT token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Decodes a JWT token payload without verification
 * Note: This only decodes, it doesn't verify the signature
 * @param token - The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token to check
 * @returns true if expired or invalid, false if still valid
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  
  if (!decoded || typeof decoded.exp !== 'number') {
    return true; // Consider invalid tokens as expired
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  return currentTime >= expirationTime;
};

/**
 * Validates if the current stored token is valid and not expired
 * @returns true if a valid, non-expired token exists
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  
  if (!token) return false;
  
  return !isTokenExpired(token);
};
