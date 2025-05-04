
import React, { useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import MetricChart from '@/components/dashboard/MetricChart';
import DataTable from '@/components/dashboard/DataTable';
import TimeRangeSelector from '@/components/dashboard/TimeRangeSelector';
import InsightsCard from '@/components/dashboard/InsightsCard';
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import { useFinancialData, extractFinancialRatios, getTrendData, formatCategoryName } from '@/hooks/useFinancialData';
import { 
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
  const [searchTerm, setSearchTerm] = useState('');
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  
  // State for uploaded financial data
  const [uploadedData, setUploadedData] = useState<any>(null);
  
  // Fetch financial data
  const { data: apiFinancialData, isLoading, error, refetch } = useFinancialData({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    metric: searchTerm || undefined,
    minValue,
    maxValue
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

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleReset = useCallback(() => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinValue(undefined);
    setMaxValue(undefined);
    refetch();
  }, [refetch]);

  // If data is loading or there's an error, use mock data
  const financialRatios = financialData ? extractFinancialRatios(financialData) : [];
  const categories = financialData?.categories || [];
  const keyInsights = financialData?.insights || mockKeyInsights;
  const recommendations = financialData?.recommendations || mockRecommendations;

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
    <DashboardLayout onUploadComplete={handleUploadComplete}>
      <DashboardHeader 
        title="Financial Dashboard"
        subtitle={`Financial Analysis & Key Performance Metrics - Generated: ${new Date().toLocaleDateString()}`} 
      />

      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium">Dashboard Overview</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <span>Quarterly</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <span>Yearly</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <span>5 Year Trend</span>
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category: string) => (
                <option key={category} value={category}>{formatCategoryName(category)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Metric</label>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by metric name..." 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
            <input 
              type="number" 
              value={minValue || ''}
              onChange={(e) => setMinValue(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Minimum value" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
            <input 
              type="number" 
              value={maxValue || ''}
              onChange={(e) => setMaxValue(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Maximum value" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-start gap-4">
          <div className="flex gap-2">
            <Button onClick={handleSearch} variant="blue">
              Apply Filters
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
          
          {/* Metric Cards now in the same row */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard 
              title="Total Records" 
              value={financialRatios.length.toString()}
              status="declined"
              subtitle="Financial ratios"
              highlights="3 Highlights to summarize the reason why it was Declined"
              className="h-full"
            />
            
            <MetricCard 
              title="Categories" 
              value={categories.length.toString()}
              status="approved"
              subtitle="Ratio categories"
              highlights="3 Highlights to summarize the reason why it was approve"
              className="h-full"
            />
            
            <MetricCard 
              title="Current Filter" 
              value={selectedCategory !== 'all' ? formatCategoryName(selectedCategory) : "All Data"}
              description="Applied filter"
              subtitle="Small Executive SUMMARY"
              className="h-full"
            />
          </div>
        </div>
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
