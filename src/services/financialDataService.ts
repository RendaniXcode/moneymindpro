import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/api.config';
import { toast } from '@/hooks/use-toast';

// Define proper types for financial data responses
export interface FinancialRatio {
  id: number;  // Changed from optional to required to match DataTable interface
  category: string;
  metric: string;
  value: string | number;
  explanation: string;
  assessment?: 'positive' | 'negative' | 'neutral';
}

export interface CategoryStatus {
  totalStatus: 'approved' | 'declined';
  categoryStatus: 'approved' | 'declined';
}

export interface FinancialDataResponse {
  data: {
    Category: string;
    Metric: string;
    Value: string;
    Explanation: string;
  }[];
  categories: string[];
  insights: string[];
  recommendations: string[];
  ratioStatus?: CategoryStatus;
  company?: string;
  year?: string;
  uploadSource?: string;
}

export interface FinancialDataParams {
  companyId?: string;
  year?: string;
  category?: string;
  metric?: string;
  minValue?: number;
  maxValue?: number;
}

/**
 * Service for fetching and processing financial data
 */
class FinancialDataService {
  /**
   * Fetch financial data from API with optional filters
   */
  async fetchFinancialData(params: FinancialDataParams = {}): Promise<FinancialDataResponse | null> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (params.companyId) queryParams.append('company_id', params.companyId);
      if (params.year) queryParams.append('year', params.year);
      if (params.category) queryParams.append('category', params.category);
      if (params.metric) queryParams.append('metric', params.metric);
      if (params.minValue !== undefined) queryParams.append('min_value', params.minValue.toString());
      if (params.maxValue !== undefined) queryParams.append('max_value', params.maxValue.toString());
      
      // Fetch data using the API client
      const endpoint = `${API_CONFIG.REST_API.endpoints.financialData}?${queryParams}`;
      const result = await apiClient.get<FinancialDataResponse>(endpoint);
      
      // Add status indicators based on financial health
      if (result) {
        result.ratioStatus = {
          totalStatus: result.data.length > 15 ? 'declined' : 'approved',
          categoryStatus: result.categories.length > 3 ? 'approved' : 'declined'
        };
      }
      
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
  }
  
  /**
   * Process S3 uploaded financial data
   */
  processS3UploadedData(data: any): FinancialDataResponse | null {
    if (!data || !data.report) {
      return null;
    }
    
    // Convert the uploaded data format to match our API format
    const processedData: FinancialDataResponse = {
      data: [],
      categories: [],
      insights: data.report.key_insights || [],
      recommendations: data.report.recommendations || [],
      // Add company information if available
      company: data.company || 'Unknown Company',
      year: data.year || new Date().getFullYear().toString(),
      uploadSource: 'S3 Transfer Accelerator'
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
  }
  
  /**
   * Format category name for display
   */
  formatCategoryName(category: string): string {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  /**
   * Format metric name for display
   */
  formatMetricName(metric: string): string {
    return metric.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  /**
   * Extract financial ratios in component-friendly format
   */
  extractFinancialRatios(data: FinancialDataResponse | null): FinancialRatio[] {
    if (!data || !data.data) {
      return [];
    }
  
    return data.data.map((item: any, index: number) => ({
      id: index + 1, // Ensure id is always provided for DataTable compatibility
      category: item.Category,
      metric: item.Metric,
      value: item.Value,
      explanation: item.Explanation,
      assessment: 'neutral' // Default assessment if not provided
    }));
  }
}

// Export a singleton instance
export const financialDataService = new FinancialDataService();
