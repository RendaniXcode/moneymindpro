
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, BarChart, XAxis, YAxis, Bar, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCategoryName, formatMetricName } from '@/hooks/useFinancialData';
import { FinancialRatio } from './DataTable';

// Chart colors
const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6', // teal
];

interface ChartSectionProps {
  ratios: FinancialRatio[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ ratios }) => {
  
  // Prepare chart data
  const prepareCategoryChartData = () => {
    if (!ratios.length) return [];
    
    const categoryCounts: Record<string, number> = {};
    ratios.forEach(item => {
      const category = formatCategoryName(item.category);
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.keys(categoryCounts).map(category => ({
      name: category,
      value: categoryCounts[category]
    }));
  };
  
  const prepareValueChartData = () => {
    if (!ratios.length) return [];
    
    // Get top 10 metrics by value
    return [...ratios]
      .map(item => ({
        name: formatMetricName(item.metric),
        value: typeof item.value === 'string' ? 
          parseFloat(item.value.toString().replace('%', '').replace('ZAR', '').replace(',', '')) : 
          item.value
      }))
      .filter(item => !isNaN(item.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };
  
  const categoryChartData = prepareCategoryChartData();
  const valueChartData = prepareValueChartData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} metrics`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Metrics by Value</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={valueChartData}
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
