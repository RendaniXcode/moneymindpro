
import { useState } from 'react';
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

export const useReportsService = () => {
  // Now we'll use our AppSync data hook
  const appSyncData = useAppSyncData();
  
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
    fetchReports,
    getReportById
  };
};
