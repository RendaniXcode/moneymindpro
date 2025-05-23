import { useQuery } from '@tanstack/react-query';
import { 
  financialDataService, 
  FinancialDataParams, 
  FinancialRatio 
} from '@/services/financialDataService';

/**
 * Hook for fetching financial data with React Query
 */
export const useFinancialData = (params: FinancialDataParams = {}) => {
  return useQuery({
    queryKey: ['financialData', params],
    queryFn: () => financialDataService.fetchFinancialData(params),
  });
};

// Re-export helper functions from the service for convenience
export const extractFinancialRatios = financialDataService.extractFinancialRatios;
export const processS3UploadedData = financialDataService.processS3UploadedData;
export const formatCategoryName = financialDataService.formatCategoryName;
export const formatMetricName = financialDataService.formatMetricName;

// Legacy function for compatibility - consider removing in future refactoring
export const getTrendData = (data: any, type: string, timeRange: string) => {
  // Since the new API doesn't provide trend data in the same format,
  // we'll continue using mock data for trends for now
  // In a real scenario, you would make a separate API call for trend data
  
  if (!data) {
    return [];
  }
  
  // This is a placeholder that returns an empty array
  // You would need to implement this based on how your API returns trend data
  return [];
};
