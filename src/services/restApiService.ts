
import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/api.config';
import { Report } from '@/hooks/useReportsService';

// Interface for the REST API response
interface RestApiReport {
  companyId: string;
  reportDate: string;
  companyName: string;
  industry: string;
  creditScore: number;
  creditDecision: string;
  reportStatus: string;
  lastUpdated: string;
  financialRatios: {
    liquidityRatios: Record<string, number>;
    profitabilityRatios: Record<string, number>;
    solvencyRatios: Record<string, number>;
    efficiencyRatios: Record<string, number>;
    marketValueRatios: Record<string, number>;
  };
  recommendations: string[];
  performanceTrends: Array<{
    year: number;
    revenue: number;
    profit: number;
    debt: number;
  }>;
}

/**
 * Service for the new REST API
 */
class RestApiService {
  /**
   * Fetch a single report by company ID and report date
   */
  async getReport(companyId: string, reportDate: string): Promise<Report | null> {
    try {
      const endpoint = `${API_CONFIG.REST_API.endpoints.reports}/${companyId}/${reportDate}`;
      const data = await apiClient.get<RestApiReport>(endpoint);
      
      if (!data) return null;
      
      return this.formatReport(data);
    } catch (error) {
      console.error('Error fetching report from REST API:', error);
      throw error;
    }
  }

  /**
   * Format REST API response to match our Report interface
   */
  private formatReport(apiData: RestApiReport): Report {
    // Convert financial ratios to our format
    const ratios: any[] = [];
    
    Object.entries(apiData.financialRatios).forEach(([category, metrics]) => {
      Object.entries(metrics).forEach(([metric, value]) => {
        ratios.push({
          category,
          metric,
          value,
          explanation: `${metric} for ${category}`,
          assessment: 'neutral' as const
        });
      });
    });

    // Convert performance trends to our format
    const trends = {
      revenue: apiData.performanceTrends.map(t => t.revenue),
      profit: apiData.performanceTrends.map(t => t.profit),
      debt: apiData.performanceTrends.map(t => t.debt)
    };

    // Calculate risk level based on credit score
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    if (apiData.creditScore >= 75) riskLevel = 'low';
    else if (apiData.creditScore >= 60) riskLevel = 'medium';
    else riskLevel = 'high';

    return {
      reportId: `${apiData.companyId}-${apiData.reportDate}`,
      companyName: apiData.companyName,
      industry: apiData.industry,
      date: apiData.reportDate,
      year: new Date(apiData.reportDate).getFullYear().toString(),
      creditScore: apiData.creditScore,
      ratios,
      insights: [], // Not provided by this API
      recommendations: apiData.recommendations,
      riskLevel,
      trends,
      companyProfile: ''
    };
  }
}

export const restApiService = new RestApiService();
