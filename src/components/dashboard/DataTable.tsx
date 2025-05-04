
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import { formatCategoryName, formatMetricName } from '@/hooks/useFinancialData';

export interface FinancialRatio {
  id: number;
  category: string;
  metric: string;
  value: number | string;
  explanation: string;
}

export interface DataTableProps {
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
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const categories = ['all', ...Array.from(new Set(data.map(item => item.category)))];

  const filteredData = data.filter(item => {
    const matchesSearch = item.metric.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort the data if a sort field is specified
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField as keyof FinancialRatio];
    let bVal = b[sortField as keyof FinancialRatio];
    
    // Handle numeric values
    if (sortField === 'value') {
      aVal = typeof aVal === 'string' ? 
        parseFloat(aVal.toString().replace('%', '').replace('ZAR', '').replace(',', '')) : 
        aVal;
      bVal = typeof bVal === 'string' ? 
        parseFloat(bVal.toString().replace('%', '').replace('ZAR', '').replace(',', '')) : 
        bVal;
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Function to toggle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  // Function to format value for display
  const formatValue = (value: string | number) => {
    if (typeof value === 'string') {
      if (value.includes('%')) return value;
      if (value.includes('ZAR')) return value;
    }
    return value;
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
              <TableHead 
                className="w-[200px] cursor-pointer" 
                onClick={() => handleSort('category')}
              >
                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('metric')}
              >
                Metric {sortField === 'metric' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="w-[100px] text-right cursor-pointer" 
                onClick={() => handleSort('value')}
              >
                Value {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="max-w-[500px]">Explanation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal", getBadgeColor(row.category))}>
                      {formatCategoryName(row.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatMetricName(row.metric)}
                  </TableCell>
                  <TableCell className={cn("text-right", getMetricStatus(row.metric, row.value))}>
                    {formatValue(row.value)}
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
