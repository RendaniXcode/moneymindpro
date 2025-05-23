
/**
 * Centralized API Configuration
 * This file contains all API endpoints and configuration settings
 */

export const API_CONFIG = {
  REST_API: {
    baseURL: 'https://4sdo9r6zx0.execute-api.us-east-1.amazonaws.com',
    endpoints: {
      financialData: '/prod/finalfuctionpoc',
      uploadData: '/prod/upload',
      analyzeDocument: '/prod/analyze',
      reports: '/v1/reports' // New REST API endpoint
    }
  },
  S3: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    bucket: import.meta.env.VITE_AWS_S3_BUCKET || 'demo-bucket',
    accelerationEnabled: import.meta.env.VITE_ENABLE_S3_ACCELERATION === 'true'
  },
  APPSYNC: {
    endpoint: 'https://at4z7qkpdnhrdjn7x2qlnqtzdy.appsync-api.us-east-1.amazonaws.com/graphql',
    apiKey: 'da2-65ytw2ppgzb4linfwcyybhwf2m',
    region: 'us-east-1'
  }
};

// Debugging function to check configuration
export const debugAPIConfig = () => {
  console.log('=== API Configuration Debug ===');
  console.log('REST API Base URL:', API_CONFIG.REST_API.baseURL);
  console.log('Reports Endpoint:', API_CONFIG.REST_API.baseURL + API_CONFIG.REST_API.endpoints.reports);
  console.log('AppSync Endpoint:', API_CONFIG.APPSYNC.endpoint);
  console.log('AppSync API Key:', API_CONFIG.APPSYNC.apiKey ? `${API_CONFIG.APPSYNC.apiKey.substring(0, 10)}...` : 'MISSING');
  console.log('AppSync Region:', API_CONFIG.APPSYNC.region);
  console.log('==============================');
};

// Error handling utilities
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Helper functions for API requests
export const handleApiError = (error: unknown): APIError => {
  console.error('API Error:', error);
  
  if (error instanceof APIError) {
    return error;
  }
  
  // Handle axios errors
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number, data?: any } };
    const statusCode = axiosError.response?.status || 500;
    const message = 
      axiosError.response?.data?.message || 
      axiosError.response?.data?.error || 
      'Unknown API error';
    
    return new APIError(message, statusCode, axiosError.response?.data);
  }
  
  // Handle other types of errors
  return new APIError(
    error instanceof Error ? error.message : 'Unknown error',
    500
  );
};
