/**
 * Environment Configuration
 * Centralized access to all environment variables
 * 
 * Note: In Vite, env variables must be prefixed with VITE_ to be exposed
 * Access via import.meta.env.VITE_VARIABLE_NAME
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Coco App';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
export const IS_DEVELOPMENT = APP_ENV === 'development';
export const IS_PRODUCTION = APP_ENV === 'production';

// Authentication Configuration
export const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'coco_auth_token';
export const AUTH_TOKEN_EXPIRY = Number(import.meta.env.VITE_AUTH_TOKEN_EXPIRY) || 3600;

// Feature Flags
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const ENABLE_DEBUG_MODE = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

/**
 * Environment config object for easy access
 */
export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT,
  },
  app: {
    name: APP_NAME,
    env: APP_ENV,
    isDevelopment: IS_DEVELOPMENT,
    isProduction: IS_PRODUCTION,
  },
  auth: {
    tokenKey: AUTH_TOKEN_KEY,
    tokenExpiry: AUTH_TOKEN_EXPIRY,
  },
  features: {
    analytics: ENABLE_ANALYTICS,
    debugMode: ENABLE_DEBUG_MODE,
  },
} as const;

export default config;

