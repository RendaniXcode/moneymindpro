
import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { APIError } from './api.config';

// Query client default options
const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime which is deprecated)
    retry: (failureCount, error) => {
      // Don't retry on 404s or authentication errors
      if (
        error instanceof APIError && 
        (error.statusCode === 404 || error.statusCode === 401 || error.statusCode === 403)
      ) {
        return false;
      }
      return failureCount < 3; // Retry up to 3 times on other errors
    },
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: false, // Don't retry mutations by default
  },
};

// Create query client with optimized settings
export const queryClient = new QueryClient({
  defaultOptions,
});
