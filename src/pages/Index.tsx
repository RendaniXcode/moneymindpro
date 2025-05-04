
import React, { useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import MetricChart from '@/components/dashboard/MetricChart';
import DataTable from '@/components/dashboard/DataTable';
import TimeRangeSelector from '@/components/dashboard/TimeRangeSelector';
import InsightsCard from '@/components/dashboard/InsightsCard';
import FileUploadButton from '@/components/dashboard/FileUploadButton';
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { useFinancialData, extractFinancialRatios, getTrendData } from '@/hooks/useFinancialData';
import { 
  financialRatios as mockFinancialRatios, 
  profitabilityTrend as mockProfitabilityTrend,
  liquidityTrend as mockLiquidityTrend,
  solvencyTrend as mockSolvencyTrend,
  yearlyProfitabilityTrend as mockYearlyProfitabilityTrend,
  yearlyLiquidityTrend as mockYearlyLiquidityTrend,
  yearlySolvencyTrend as mockYearlySolvencyTrend,
  fiveYearProfitabilityTrend as mockFiveYearProfitabilityTrend,
  fiveYearLiquidityTrend as mockFiveYearLiquidityTrend,
  fiveYearSolvencyTrend as mockFiveYearSolvencyTrend,
  keyInsights as mockKeyInsights,
  recommendations as mockRecommendations
} from '@/data/financialData';

const Index = () => {
  const [timeRange, setTimeRange] = useState('quarterly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [companyId] = useState('multichoice-group');
  const [year] = useState('2024');
  
  // State for uploaded financial data
  const [uploadedData, setUploadedData] = useState<any>(null);
  
  // Fetch financial data
  const { data: apiFinancialData, isLoading, error, refetch } = useFinancialData({
    companyId,
    year,
  });

  // Use uploaded data if available, otherwise use API data
  const financialData = uploadedData || apiFinancialData;

  // Handle file upload completion
  const handleUploadComplete = useCallback((data: any) => {
    if (data && data.report) {
      setUploadedData(data);
      toast({
        title: "Data Loaded",
        description: `Financial data for ${data.company || 'Unknown Company'} has been loaded.`,
      });
    } else {
      toast({
        title: "Invalid Data Format",
        description: "The uploaded file doesn't contain valid financial report data.",
        variant: "destructive",
      });
    }
  }, []);

  // If data is loading or there's an error, use mock data
  const financialRatios = financialData ? extractFinancialRatios(financialData) : mockFinancialRatios;
  const keyInsights = financialData?.report?.key_insights || mockKeyInsights;
  const recommendations = financialData?.report?.recommendations || mockRecommendations;

  // Get latest ratio value
  const getLatestRatio = (metricName: string) => {
    const ratio = financialRatios.find(r => r.metric === metricName);
    return ratio ? ratio.value : 0;
  };

  // Function to get data based on time range
  const getChartData = (type: string) => {
    // Try to get data from API response first
    if (financialData) {
      return getTrendData(financialData, type, timeRange);
    }
    
    // Fall back to mock data if API data is not available
    switch (type) {
      case 'profitability':
        return timeRange === 'quarterly' 
          ? mockProfitabilityTrend 
          : timeRange === 'yearly' 
            ? mockYearlyProfitabilityTrend 
            : mockFiveYearProfitabilityTrend;
      case 'liquidity':
        return timeRange === 'quarterly' 
          ? mockLiquidityTrend 
          : timeRange === 'yearly' 
            ? mockYearlyLiquidityTrend 
            : mockFiveYearLiquidityTrend;
      case 'solvency':
        return timeRange === 'quarterly' 
          ? mockSolvencyTrend 
          : timeRange === 'yearly' 
            ? mockYearlySolvencyTrend 
            : mockFiveYearSolvencyTrend;
      default:
        return mockProfitabilityTrend;
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title={`${financialData?.company || 'MultiChoice Group'} Financial Dashboard`}
        subtitle={`Financial Analysis & Key Performance Metrics - ${year} | Generated: ${
          financialData?.generated_at 
            ? new Date(financialData.generated_at).toLocaleDateString() 
            : new Date().toLocaleDateString()
        }`} 
      />

      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium">Dashboard Overview</h3>
          <FileUploadButton onUploadComplete={handleUploadComplete} />
        </div>
        <TimeRangeSelector 
          value={timeRange}
          onChange={setTimeRange}
        />
      </div>
      
      {isLoading && !uploadedData && (
        <div className="text-center py-8 text-muted-foreground">
          Loading financial data...
        </div>
      )}
      
      {error && !isLoading && !uploadedData && (
        <div className="text-center py-8 text-red-500">
          Error loading data. Using cached data instead.
        </div>
      )}
      
      {/* Display upload source if data came from upload */}
      {uploadedData && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded mb-6 flex items-center justify-between">
          <div>
            <p className="font-medium">Using uploaded financial data</p>
            <p className="text-sm">Showing data for {uploadedData.company || 'Unknown Company'}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setUploadedData(null);
              refetch();
            }}
          >
            Reset to API Data
          </Button>
        </div>
      )}
      
      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <MetricCard 
          title="Current Ratio" 
          value={getLatestRatio('current_ratio')}
          description="Short-term liquidity"
          trend="up"
          trendValue="+0.10"
        />
        <MetricCard 
          title="Gross Profit Margin" 
          value={`${getLatestRatio('gross_profit_margin')}%`}
          description="Core profitability"
          trend="down"
          trendValue="-1.1%"
        />
        <MetricCard 
          title="Debt to Equity" 
          value={getLatestRatio('debt_to_equity_ratio')}
          description="Leverage ratio"
          trend="up"
          trendValue="+0.03"
        />
        <MetricCard 
          title="Return on Equity" 
          value={`${getLatestRatio('return_on_equity')}%`}
          description="Shareholder returns"
          trend="down"
          trendValue="-2.8%"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MetricChart 
          title="Profitability Trends"
          defaultType="line"
          data={getChartData('profitability')}
          dataKey="gross_margin"
          color="#10b981"
          showControls={true}
        />
        <MetricChart 
          title="Liquidity Ratio Trend"
          defaultType="area"
          data={getChartData('liquidity')}
          dataKey="value"
          color="#3b82f6"
          showControls={true}
        />
      </div>
      
      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <InsightsCard 
          title="Key Insights" 
          insights={keyInsights} 
          type="insights"
        />
        <InsightsCard 
          title="Recommendations" 
          insights={recommendations} 
          type="recommendations"
        />
      </div>
      
      {/* Data Table */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Financial Ratios Analysis</h2>
        <DataTable 
          data={financialRatios} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;
