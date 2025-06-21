/**
 * API configuration for the frontend
 * Uses environment variables to determine the API URL based on environment
 */

// Get the API URL from environment variables or fallback to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api/v1';

// Helper function to build full API endpoints
export const getEndpoint = (path: string): string => {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}; 