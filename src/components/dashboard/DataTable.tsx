
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';
import CategoryFilter from './CategoryFilter';

export interface FinancialRatio {
  id: number;
  category: string;
  metric: string;
  value: number | string;
  explanation: string;
}

interface DataTableProps {
  data: FinancialRatio[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  selectedCategory = 'all', 
  onSelectCategory = () => {}, 
  className 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search metrics or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm px-3 py-1 border rounded-md hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            <Badge variant="secondary" className="ml-1">
              {selectedCategory === 'all' ? 'All' : '1'}
            </Badge>
          </button>
        </div>
        
        {showFilters && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        )}
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
                      {row.category.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {row.metric.replace(/_/g, ' ')}
                  </TableCell>
                  <TableCell className={cn("text-right", getMetricStatus(row.metric, row.value))}>
                    {typeof row.value === 'number' && row.metric.includes('margin') ? `${row.value}%` : row.value}
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
