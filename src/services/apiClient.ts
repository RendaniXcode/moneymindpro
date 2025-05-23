
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, APIError, handleApiError } from '@/config/api.config';
import { toast } from '@/hooks/use-toast';

/**
 * Centralized API Client for handling REST API requests
 */
class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.REST_API.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });
    
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // You can add common request handling here
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError = handleApiError(error);
        
        // Show toast for client-side network errors
        if (!error.response) {
          toast({
            title: "Network Error",
            description: "Could not connect to the server. Please check your internet connection.",
            variant: "destructive",
          });
        }
        
        return Promise.reject(apiError);
      }
    );
  }
  
  /**
   * Perform a GET request
   * @param url The endpoint URL
   * @param config Optional Axios config
   * @returns Promise with the response data
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
  
  /**
   * Perform a POST request
   * @param url The endpoint URL
   * @param data The data to send
   * @param config Optional Axios config
   * @returns Promise with the response data
   */
  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
  
  /**
   * Perform a PUT request
   * @param url The endpoint URL
   * @param data The data to send
   * @param config Optional Axios config
   * @returns Promise with the response data
   */
  async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
  
  /**
   * Perform a DELETE request
   * @param url The endpoint URL
   * @param config Optional Axios config
   * @returns Promise with the response data
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();
