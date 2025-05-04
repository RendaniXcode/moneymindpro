
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import MetricChart from '@/components/dashboard/MetricChart';
import DataTable from '@/components/dashboard/DataTable';
import TimeRangeSelector from '@/components/dashboard/TimeRangeSelector';
import { 
  financialRatios, 
  categoryChartData, 
  profitabilityTrend, 
  liquidityTrend, 
  solvencyTrend 
} from '@/data/financialData';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [timeRange, setTimeRange] = useState('quarterly');

  // Filter ratios by category for metric cards
  const getLatestRatio = (metricName: string) => {
    const ratio = financialRatios.find(r => r.metric === metricName);
    return ratio ? ratio.value : 0;
  };

  // Function to get data based on time range
  // In a real app, this would fetch different data sets
  const getChartData = (type: string) => {
    switch (type) {
      case 'profitability':
        return profitabilityTrend;
      case 'liquidity':
        return liquidityTrend;
      case 'solvency':
        return solvencyTrend;
      default:
        return profitabilityTrend;
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="MultiChoice Group Financial Dashboard" 
        subtitle="Financial Analysis & Key Performance Metrics - 2024" 
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
          description="Healthy short-term liquidity"
          trend="down"
          trendValue="-0.05"
        />
        <MetricCard 
          title="Gross Profit Margin" 
          value={`${getLatestRatio('gross_profit_margin')}%`}
          description="Strong pricing power"
          trend="down"
          trendValue="-2.0%"
        />
        <MetricCard 
          title="Debt to Equity" 
          value={getLatestRatio('debt_to_equity_ratio')}
          description="Moderate leverage"
          trend="up"
          trendValue="+0.05"
        />
        <MetricCard 
          title="Return on Equity" 
          value={`${getLatestRatio('return_on_equity')}%`}
          description="Below industry average"
          trend="down"
          trendValue="-1.4%"
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
      
      {/* Data Table */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Financial Ratios Analysis</h2>
        <DataTable data={financialRatios} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
