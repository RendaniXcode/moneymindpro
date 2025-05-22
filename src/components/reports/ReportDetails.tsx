
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Report } from '@/hooks/useReportsService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';

interface ReportDetailsProps {
  report: Report;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report }) => {
  // Transform trend data for recharts
  const chartData = Array(5).fill(0).map((_, index) => ({
    name: `Year ${index + 1}`,
    revenue: report.trends.revenue[index],
    profit: report.trends.profit[index],
    debt: report.trends.debt[index]
  }));
  
  // Calculate key risk indicators
  const debtToRevenue = (report.trends.debt[4] / report.trends.revenue[4]).toFixed(2);
  const profitGrowth = calculateGrowth(report.trends.profit);
  const revenueGrowth = calculateGrowth(report.trends.revenue);
  
  // Calculate overall trend
  function calculateGrowth(data: number[]) {
    if (data.length < 2) return 0;
    return ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1);
  }
  
  // Determine approval status based on credit score
  const approvalStatus = report.creditScore >= 70 ? 'approved' : 'declined';
  
  return (
    <div className="space-y-3">
      {/* Credit Decision */}
      <div>
        <h3 className="text-lg font-medium mb-1.5">Credit Decision</h3>
        <div className={`border rounded-md p-4 max-w-xs flex flex-col items-center ${
          approvalStatus === 'approved' 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          <div className={`h-20 w-20 rounded-full flex items-center justify-center mb-2 ${
            approvalStatus === 'approved' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <span className="text-3xl font-bold text-white">{report.creditScore}</span>
          </div>
          <div className={`flex items-center gap-1.5 font-medium ${
            approvalStatus === 'approved' ? 'text-green-700' : 'text-red-700'
          }`}>
            {approvalStatus === 'approved' ? (
              <><CheckCircle className="h-5 w-5" /> APPROVED</>
            ) : (
              <><XCircle className="h-5 w-5" /> DECLINED</>
            )}
          </div>
          <div className="text-sm text-center text-muted-foreground mt-1">
            Credit {approvalStatus} based on financial analysis
          </div>
        </div>
      </div>
      
      {/* Company Profile */}
      <div>
        <h3 className="text-lg font-medium mb-1.5">Company Profile</h3>
        <p className="text-muted-foreground">{report.companyProfile}</p>
      </div>
      
      {/* Financial Performance Trends */}
      <div>
        <h3 className="text-lg font-medium mb-1.5">Financial Performance Trends</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#a7f3d0" name="Profit" />
              <Area type="monotone" dataKey="debt" stroke="#f59e0b" fill="#fcd34d" name="Debt" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="p-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Revenue Growth</h4>
            {Number(revenueGrowth) > 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="mt-1 text-2xl font-bold">
            {revenueGrowth}%
          </div>
          <div className="text-xs text-muted-foreground">
            Over the last 5 years
          </div>
        </Card>
        
        <Card className="p-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Profit Growth</h4>
            {Number(profitGrowth) > 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="mt-1 text-2xl font-bold">
            {profitGrowth}%
          </div>
          <div className="text-xs text-muted-foreground">
            Over the last 5 years
          </div>
        </Card>
        
        <Card className="p-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Debt to Revenue</h4>
            {Number(debtToRevenue) < 0.5 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600" />
            )}
          </div>
          <div className="mt-1 text-2xl font-bold">
            {debtToRevenue}
          </div>
          <div className="text-xs text-muted-foreground">
            Current ratio
          </div>
        </Card>
      </div>
      
      {/* Risk Assessment */}
      <div>
        <h3 className="text-lg font-medium mb-1.5">Risk Assessment</h3>
        <div className={`p-2 rounded-md ${
          report.riskLevel === 'low' ? 'bg-green-50 border border-green-200' :
          report.riskLevel === 'medium' ? 'bg-amber-50 border border-amber-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <div className={`rounded-full p-1.5 mr-2 ${
              report.riskLevel === 'low' ? 'bg-green-100' :
              report.riskLevel === 'medium' ? 'bg-amber-100' :
              'bg-red-100'
            }`}>
              <AlertCircle className={`h-4 w-4 ${
                report.riskLevel === 'low' ? 'text-green-700' :
                report.riskLevel === 'medium' ? 'text-amber-700' :
                'text-red-700'
              }`} />
            </div>
            <div>
              <h4 className="font-medium">
                {report.riskLevel === 'low' ? 'Low Risk Profile' :
                report.riskLevel === 'medium' ? 'Medium Risk Profile' :
                'High Risk Profile'}
              </h4>
              <p className="text-sm">
                {report.riskLevel === 'low' ? 
                  'This company demonstrates strong financial health with minimal credit risk. It has stable cash flows, manageable debt levels, and consistent profitability.' :
                report.riskLevel === 'medium' ? 
                  'This company shows moderate financial stability with some potential areas of concern. While generally stable, there are specific metrics that require monitoring.' :
                  'This company exhibits significant financial challenges that may impact its ability to meet obligations. Close monitoring and risk mitigation strategies are highly recommended.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Insights */}
      <div>
        <h3 className="text-lg font-medium mb-1.5">Key Insights</h3>
        <div className="space-y-1">
          {report.insights.map((insight, index) => (
            <div key={index} className="flex gap-2 p-2 bg-gray-50 rounded-md">
              <div className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
