
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIError } from '@/config/api.config';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for centralized error handling
 */
export const useErrorHandler = () => {
  const navigate = useNavigate();
  
  const handleError = useCallback((error: unknown) => {
    console.error('Error caught by useErrorHandler:', error);
    
    // Handle API errors
    if (error instanceof APIError) {
      switch (error.statusCode) {
        case 400:
          toast({
            title: "Bad Request",
            description: error.message || "The request was invalid",
            variant: "destructive",
          });
          break;
          
        case 404:
          toast({
            title: "Not Found",
            description: error.message || "The requested resource was not found",
            variant: "destructive",
          });
          break;
          
        case 429:
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please try again later.",
            variant: "destructive",
          });
          break;
          
        case 500:
        case 502:
        case 503:
          toast({
            title: "Server Error",
            description: "Something went wrong on our servers. Please try again later.",
            variant: "destructive",
          });
          break;
          
        default:
          toast({
            title: "Error",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
          });
      }
    } else if (error instanceof Error) {
      // Handle standard JS errors
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } else {
      // Handle unknown errors
      toast({
        title: "Unknown Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }, [navigate]);
  
  return handleError;
};
