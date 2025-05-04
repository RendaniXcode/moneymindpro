
import { useQuery } from '@tanstack/react-query';
import { GET_FINANCIAL_DATA } from '@/graphql/queries';
import { apolloClient } from '@/lib/graphql';
import { toast } from '@/components/ui/use-toast';

interface FinancialDataParams {
  companyId: string;
  year: string;
}

export const useFinancialData = ({ companyId, year }: FinancialDataParams) => {
  return useQuery({
    queryKey: ['financialData', companyId, year],
    queryFn: async () => {
      try {
        const { data } = await apolloClient.query({
          query: GET_FINANCIAL_DATA,
          variables: { companyId, year },
        });
        return data.getFinancialReport;
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

// Helper functions to get specific data from the financial report
export const extractFinancialRatios = (data: any) => {
  if (!data || !data.report || !data.report.financial_ratios) {
    return [];
  }

  const { financial_ratios } = data.report;
  const result = [];
  let id = 1;

  // Process each category of ratios
  for (const [categoryKey, category] of Object.entries(financial_ratios)) {
    for (const [metricKey, metric] of Object.entries(category as any)) {
      result.push({
        id: id++,
        category: categoryKey,
        metric: metricKey,
        value: (metric as any).value,
        explanation: (metric as any).explanation
      });
    }
  }

  return result;
};

export const getTrendData = (data: any, type: string, timeRange: string) => {
  if (!data || !data.getTrendData) {
    return [];
  }
  
  const trendData = data.getTrendData;
  
  if (type === 'profitability') {
    return trendData.profitability_trends.filter((item: any) => 
      timeRange === 'quarterly' ? item.name.includes('Q') :
      timeRange === 'yearly' ? !item.name.includes('Q') :
      true // 5year returns all
    );
  } else if (type === 'liquidity') {
    return trendData.liquidity_trends.filter((item: any) => 
      timeRange === 'quarterly' ? item.name.includes('Q') :
      timeRange === 'yearly' ? !item.name.includes('Q') :
      true // 5year returns all
    );
  } else if (type === 'solvency') {
    return trendData.solvency_trends.filter((item: any) => 
      timeRange === 'quarterly' ? item.name.includes('Q') :
      timeRange === 'yearly' ? !item.name.includes('Q') :
      true // 5year returns all
    );
  }
  
  return [];
};
