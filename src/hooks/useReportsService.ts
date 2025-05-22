
import { useState } from 'react';
import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { useAppSyncData, CreditDecision } from './useAppSyncData';

// Type definitions
export interface Report {
  reportId: string;
  companyName: string;
  industry: string;
  date: string;
  year: string;
  creditScore: number;
  ratios: FinancialRatio[];
  insights: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  trends: {
    revenue: number[];
    profit: number[];
    debt: number[];
  };
  companyProfile: string;
}

export interface FinancialRatio {
  category: string;
  metric: string;
  value: string | number;
  explanation: string;
  assessment: 'positive' | 'negative' | 'neutral';
}

/**
 * Hook for managing reports data with React Query integration
 * Provides methods and queries for fetching and managing reports
 */
export const useReportsService = () => {
  // Use our AppSync data hook
  const appSyncData = useAppSyncData();
  
  /**
   * Fetches all reports
   * @param options Optional query options
   * @returns React Query result with reports data
   */
  const useReports = (options = {}) => {
    return useQuery({
      queryKey: ['reports'],
      queryFn: async () => {
        try {
          return await appSyncData.fetchAllReports() || [];
        } catch (error) {
          console.error("Error in useReports query:", error);
          throw error; // Let React Query handle the error
        }
      },
      ...options
    });
  };
  
  /**
   * Fetches a single report by ID
   * @param reportId The report ID in format "companyId-reportDate"
   * @param options Optional query options
   * @returns React Query result with report data
   */
  const useReport = (reportId: string | null, options = {}) => {
    return useQuery({
      queryKey: ['report', reportId],
      queryFn: async () => {
        if (!reportId) return null;
        
        try {
          // Parse the reportId to get companyId and reportDate
          const [companyId, reportDate] = reportId.split('-');
          
          if (companyId && reportDate) {
            return await appSyncData.getFinancialReport(companyId, reportDate);
          } else {
            throw new Error("Invalid reportId format: " + reportId);
          }
        } catch (error) {
          console.error("Error fetching report details:", error);
          throw error; // Let React Query handle the error
        }
      },
      enabled: !!reportId, // Only run the query if reportId is provided
      ...options
    });
  };
  
  /**
   * Fetches reports filtered by industry
   * @param industry The industry to filter by
   * @param options Optional query options
   * @returns React Query result with filtered reports
   */
  const useReportsByIndustry = (industry: string | null, options = {}) => {
    return useQuery({
      queryKey: ['reports', 'industry', industry],
      queryFn: async () => {
        if (!industry) return [];
        
        try {
          return await appSyncData.listReportsByIndustry(industry) || [];
        } catch (error) {
          console.error(`Error fetching reports for industry ${industry}:`, error);
          throw error;
        }
      },
      enabled: !!industry,
      ...options
    });
  };
  
  /**
   * Fetches reports filtered by credit decision
   * @param decision The credit decision to filter by
   * @param options Optional query options
   * @returns React Query result with filtered reports
   */
  const useReportsByCreditDecision = (decision: CreditDecision | null, options = {}) => {
    return useQuery({
      queryKey: ['reports', 'creditDecision', decision],
      queryFn: async () => {
        if (!decision) return [];
        
        try {
          return await appSyncData.listReportsByCreditDecision(decision) || [];
        } catch (error) {
          console.error(`Error fetching reports for credit decision ${decision}:`, error);
          throw error;
        }
      },
      enabled: !!decision,
      ...options
    });
  };
  
  /**
   * Creates a new financial report
   * @returns Mutation hook for creating reports
   */
  const useCreateReport = () => {
    return useMutation({
      mutationFn: async (reportData: any) => {
        try {
          const result = await appSyncData.createFinancialReport(reportData);
          toast({
            title: "Report Created",
            description: "Financial report has been successfully created",
          });
          return result;
        } catch (error) {
          console.error("Error creating financial report:", error);
          toast({
            title: "Error Creating Report",
            description: "Failed to create the financial report",
            variant: "destructive",
          });
          throw error;
        }
      },
      // Options for optimistic updates and cache invalidation
      onSuccess: () => {
        // Invalidate queries to refetch data after mutation
        // This would be handled by the calling component using the QueryClient
      }
    });
  };
  
  /**
   * Updates an existing financial report
   * @returns Mutation hook for updating reports
   */
  const useUpdateReport = () => {
    return useMutation({
      mutationFn: async (reportData: any) => {
        try {
          const result = await appSyncData.updateFinancialReport(reportData);
          toast({
            title: "Report Updated",
            description: "Financial report has been successfully updated",
          });
          return result;
        } catch (error) {
          console.error("Error updating financial report:", error);
          toast({
            title: "Error Updating Report",
            description: "Failed to update the financial report",
            variant: "destructive",
          });
          throw error;
        }
      }
    });
  };
  
  // Legacy methods for backward compatibility
  const fetchReports = async (): Promise<Report[]> => {
    try {
      // Use the AppSync integration
      return await appSyncData.fetchAllReports() || [];
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error fetching reports",
        description: "Could not load the financial reports data.",
        variant: "destructive",
      });
      return [];
    }
  };
  
  const getReportById = async (reportId: string): Promise<Report | null> => {
    try {
      // Parse the reportId to get companyId and reportDate
      const [companyId, reportDate] = reportId.split('-');
      
      if (companyId && reportDate) {
        return await appSyncData.getFinancialReport(companyId, reportDate);
      } else {
        console.error("Invalid reportId format:", reportId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
      toast({
        title: "Error fetching report",
        description: "Could not load the financial report details.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  return {
    // Modern React Query hooks
    useReports,
    useReport,
    useReportsByIndustry,
    useReportsByCreditDecision,
    useCreateReport,
    useUpdateReport,
    // Legacy methods for backward compatibility
    fetchReports,
    getReportById
  };
};
