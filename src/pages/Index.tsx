
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import MetricChart from '@/components/dashboard/MetricChart';
import DataTable from '@/components/dashboard/DataTable';
import TimeRangeSelector from '@/components/dashboard/TimeRangeSelector';
import InsightsCard from '@/components/dashboard/InsightsCard';
import { 
  financialRatios, 
  categoryChartData, 
  profitabilityTrend, 
  liquidityTrend, 
  solvencyTrend,
  yearlyProfitabilityTrend,
  yearlyLiquidityTrend,
  yearlySolvencyTrend,
  fiveYearProfitabilityTrend,
  fiveYearLiquidityTrend,
  fiveYearSolvencyTrend,
  keyInsights,
  recommendations
} from '@/data/financialData';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [timeRange, setTimeRange] = useState('quarterly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get latest ratio value
  const getLatestRatio = (metricName: string) => {
    const ratio = financialRatios.find(r => r.metric === metricName);
    return ratio ? ratio.value : 0;
  };

  // Function to get data based on time range
  const getChartData = (type: string) => {
    // Select the appropriate data based on the time range
    switch (type) {
      case 'profitability':
        return timeRange === 'quarterly' 
          ? profitabilityTrend 
          : timeRange === 'yearly' 
            ? yearlyProfitabilityTrend 
            : fiveYearProfitabilityTrend;
      case 'liquidity':
        return timeRange === 'quarterly' 
          ? liquidityTrend 
          : timeRange === 'yearly' 
            ? yearlyLiquidityTrend 
            : fiveYearLiquidityTrend;
      case 'solvency':
        return timeRange === 'quarterly' 
          ? solvencyTrend 
          : timeRange === 'yearly' 
            ? yearlySolvencyTrend 
            : fiveYearSolvencyTrend;
      default:
        return profitabilityTrend;
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="MultiChoice Group Financial Dashboard" 
        subtitle={`Financial Analysis & Key Performance Metrics - 2024 | Generated: ${new Date().toLocaleDateString()}`} 
      />

      <div className="flex flex-wrap justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Dashboard Overview</h3>
        <TimeRangeSelector 
          value={timeRange}
          onChange={setTimeRange}
          className="w-[180px]"
        />
      </div>
      
      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <MetricCard 
          title="Current Ratio" 
          value={getLatestRatio('current_ratio')}
          description="Strong short-term liquidity"
          trend="up"
          trendValue="+0.10"
        />
        <MetricCard 
          title="Gross Profit Margin" 
          value={`${getLatestRatio('gross_profit_margin')}%`}
          description="Healthy core profitability"
          trend="down"
          trendValue="-1.1%"
        />
        <MetricCard 
          title="Debt to Equity" 
          value={getLatestRatio('debt_to_equity_ratio')}
          description="Conservative leverage"
          trend="up"
          trendValue="+0.03"
        />
        <MetricCard 
          title="Return on Equity" 
          value={`${getLatestRatio('return_on_equity')}%`}
          description="Below industry average"
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
