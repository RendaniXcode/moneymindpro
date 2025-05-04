
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

export interface FinancialRatio {
  id: number;
  category: string;
  metric: string;
  value: number | string;
  explanation: string;
}

interface DataTableProps {
  data: FinancialRatio[];
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(data.map(item => item.category)))];

  const filteredData = data.filter(item => {
    const matchesSearch = item.metric.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to get badge color based on category
  const getBadgeColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'liquidity_ratios': 'bg-blue-100 text-blue-800',
      'profitability_ratios': 'bg-green-100 text-green-800',
      'solvency_ratios': 'bg-purple-100 text-purple-800',
      'efficiency_ratios': 'bg-amber-100 text-amber-800',
      'market_value_ratios': 'bg-indigo-100 text-indigo-800',
    };
    
    return categoryMap[category] || 'bg-gray-100 text-gray-800';
  };

  // Function to determine if a metric is positive, negative, or neutral
  const getMetricStatus = (metricName: string, value: number | string) => {
    if (typeof value === 'string') return 'metric-neutral';
    
    // This is a simplified logic - in a real app, we'd have more complex rules
    const positiveMetrics = ['current_ratio', 'quick_ratio', 'gross_profit_margin', 'operating_profit_margin', 
      'return_on_assets', 'return_on_equity', 'interest_coverage_ratio', 'debt_service_coverage_ratio'];
    const negativeMetrics = ['debt_to_equity_ratio', 'debt_to_assets_ratio'];
    
    if (positiveMetrics.includes(metricName)) {
      return value >= 1.0 ? 'metric-positive' : 'metric-negative';
    } else if (negativeMetrics.includes(metricName)) {
      return value <= 0.5 ? 'metric-positive' : 'metric-negative';
    }
    
    return 'metric-neutral';
  };

  return (
    <div className={cn("bg-white rounded-md border", className)}>
      <div className="p-4 space-y-4">
        <Input
          placeholder="Search metrics or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "cursor-pointer hover:opacity-80 transition-opacity",
                category === 'all' ? 'bg-slate-100 text-slate-800' : getBadgeColor(category),
                selectedCategory === category ? "ring-1 ring-black ring-offset-1" : ""
              )}
            >
              {category === 'all' ? 'All Categories' : category.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Category</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead className="w-[100px] text-right">Value</TableHead>
              <TableHead className="max-w-[500px]">Explanation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal", getBadgeColor(row.category))}>
                      {row.category.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {row.metric.replace('_', ' ')}
                  </TableCell>
                  <TableCell className={cn("text-right", getMetricStatus(row.metric, row.value))}>
                    {row.value}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[500px]">
                    {row.explanation}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
