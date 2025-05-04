
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import MetricChart from '@/components/dashboard/MetricChart';
import DataTable from '@/components/dashboard/DataTable';
import { 
  financialRatios, 
  categoryChartData, 
  profitabilityTrend, 
  liquidityTrend, 
  solvencyTrend 
} from '@/data/financialData';

const Index = () => {
  // Filter ratios by category for metric cards
  const getLatestRatio = (metricName: string) => {
    const ratio = financialRatios.find(r => r.metric === metricName);
    return ratio ? ratio.value : 0;
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="MultiChoice Group Financial Dashboard" 
        subtitle="Financial Analysis & Key Performance Metrics - 2024" 
      />
      
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
          title="Profitability Trends (Quarterly)"
          type="line"
          data={profitabilityTrend}
          dataKey="gross_margin"
          color="#10b981"
        />
        <MetricChart 
          title="Liquidity Ratio Trend (Quarterly)"
          type="line"
          data={liquidityTrend}
          dataKey="value"
          color="#3b82f6"
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
