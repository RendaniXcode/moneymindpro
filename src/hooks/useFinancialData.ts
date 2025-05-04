

import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface FinancialDataParams {
  companyId?: string;
  year?: string;
  category?: string;
  metric?: string;
  minValue?: number;
  maxValue?: number;
}

const API_ENDPOINT = 'https://10o0oyafx1.execute-api.eu-west-1.amazonaws.com/prod/finalfuctionpoc';

export const useFinancialData = (params: FinancialDataParams = {}) => {
  return useQuery({
    queryKey: ['financialData', params],
    queryFn: async () => {
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        
        if (params.companyId) queryParams.append('company_id', params.companyId);
        if (params.year) queryParams.append('year', params.year);
        if (params.category) queryParams.append('category', params.category);
        if (params.metric) queryParams.append('metric', params.metric);
        if (params.minValue !== undefined) queryParams.append('min_value', params.minValue.toString());
        if (params.maxValue !== undefined) queryParams.append('max_value', params.maxValue.toString());
        
        // Fetch data
        const response = await fetch(`${API_ENDPOINT}?${queryParams}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data');
        }
        
        // Add status indicators based on financial health
        result.ratioStatus = {
          totalStatus: result.data.length > 15 ? 'declined' : 'approved',
          categoryStatus: result.categories.length > 3 ? 'approved' : 'declined'
        };
        
        return result;
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch financial data. Using cached data instead.",
          variant: "destructive",
        });
        // Return null to indicate error - the component will use mock data
        return null;
      }
    },
  });
};

// Helper functions to transform API data into the format expected by components
export const extractFinancialRatios = (data: any) => {
  if (!data || !data.data) {
    return [];
  }

  return data.data.map((item: any, index: number) => ({
    id: index + 1,
    category: item.Category,
    metric: item.Metric,
    value: item.Value,
    explanation: item.Explanation
  }));
};

// Helper to process S3 uploaded data
export const processS3UploadedData = (data: any) => {
  if (!data || !data.report) {
    return null;
  }
  
  // Convert the uploaded data format to match our API format
  const processedData = {
    data: [],
    categories: [],
    insights: data.report.key_insights || [],
    recommendations: data.report.recommendations || []
  };
  
  // Process financial ratios
  if (data.report.financial_ratios) {
    const categories = Object.keys(data.report.financial_ratios);
    processedData.categories = categories;
    
    // Convert nested structure to flat array format
    categories.forEach(category => {
      const metrics = data.report.financial_ratios[category];
      Object.keys(metrics).forEach(metricName => {
        const metricData = metrics[metricName];
        processedData.data.push({
          Category: category,
          Metric: metricName,
          Value: metricData.value.toString(),
          Explanation: metricData.explanation
        });
      });
    });
  }
  
  return processedData;
};

// Format helpers for display
export const formatCategoryName = (category: string) => {
  return category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const formatMetricName = (metric: string) => {
  return metric.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

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
