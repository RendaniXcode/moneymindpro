
import React, { useState, lazy, Suspense } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useFinancialData, extractFinancialRatios, formatCategoryName, formatMetricName } from '@/hooks/useFinancialData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Download, Filter } from 'lucide-react';

// Lazy load components that aren't needed on initial render
const DataTable = lazy(() => import('@/components/dashboard/DataTable'));
const ChartSection = lazy(() => import('@/components/dashboard/ChartSection'));

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchMetric, setSearchMetric] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Query params for the API - only include category if it's not empty
  const queryParams = {
    ...(selectedCategory !== '' ? { category: selectedCategory } : {}),
    ...(searchMetric ? { metric: searchMetric } : {}),
    ...(minValue ? { minValue: parseFloat(minValue) } : {}),
    ...(maxValue ? { maxValue: parseFloat(maxValue) } : {})
  };

  // Fetch data using the hook
  const { data: financialData, refetch, isLoading } = useFinancialData(queryParams);
  const ratios = financialData ? extractFinancialRatios(financialData) : [];
  
  // Get unique categories for the filter dropdowns
  const categories = financialData?.categories || [];

  // Apply filters
  const applyFilters = () => {
    refetch();
    toast({
      title: 'Filters Applied',
      description: 'The dashboard has been filtered according to your criteria',
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSearchMetric('');
    setMinValue('');
    setMaxValue('');
    refetch();
    toast({
      title: 'Filters Reset',
      description: 'All filters have been cleared',
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    if (ratios.length === 0) {
      toast({
        title: 'No Data',
        description: 'No data available to export',
        variant: 'destructive',
      });
      return;
    }
    
    // Create CSV content
    const headers = ['Category', 'Metric', 'Value', 'Explanation'];
    const csvContent = [
      headers.join(','),
      ...ratios.map(row => 
        [row.category, row.metric, row.value, `"${row.explanation}"`].join(',')
      )
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'multichoice_financial_ratios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export Complete',
      description: 'Financial data has been exported to CSV',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader 
          title="MultiChoice Financial Dashboard" 
          subtitle="2024 Financial Ratios Analysis"
          onApplyFilters={applyFilters}
          onExport={exportToCSV}
        />
        
        {/* Filters Section */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full border rounded-md p-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Metric</label>
              <Input 
                placeholder="Search by metric name..." 
                value={searchMetric}
                onChange={(e) => setSearchMetric(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
              <Input 
                placeholder="Minimum value" 
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
              <Input 
                placeholder="Maximum value" 
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
              Export to CSV
            </Button>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4 border">
              <h4 className="text-sm text-gray-500 mb-1">Total Records</h4>
              <div className="text-2xl font-bold">{ratios.length}</div>
            </Card>
            <Card className="p-4 border">
              <h4 className="text-sm text-gray-500 mb-1">Categories</h4>
              <div className="text-2xl font-bold">{categories.length}</div>
            </Card>
            <Card className="p-4 border">
              <h4 className="text-sm text-gray-500 mb-1">Current Filter</h4>
              <div className="text-lg font-bold">
                {selectedCategory || searchMetric || minValue || maxValue ? 'Custom Filter' : 'All Data'}
              </div>
              <div className="text-xs text-gray-500">
                {[
                  selectedCategory && `Category: ${formatCategoryName(selectedCategory)}`,
                  searchMetric && `Metric: "${searchMetric}"`,
                  minValue && `Min: ${minValue}`,
                  maxValue && `Max: ${maxValue}`
                ].filter(Boolean).join(', ')}
              </div>
            </Card>
          </div>
        </Card>
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Data Table with Suspense for lazy loading */}
        {!isLoading && (
          <Suspense fallback={<div className="flex justify-center py-8">Loading data table...</div>}>
            <Card>
              <CardHeader>
                <CardTitle>Financial Ratios</CardTitle>
                <CardDescription>
                  Detailed breakdown of financial metrics and ratios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={ratios}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </CardContent>
            </Card>
          </Suspense>
        )}
        
        {/* Chart Section with Suspense for lazy loading */}
        {!isLoading && ratios.length > 0 && (
          <Suspense fallback={<div className="flex justify-center py-8">Loading charts...</div>}>
            <ChartSection ratios={ratios} />
          </Suspense>
        )}
        
        <div className="mt-8 flex justify-end">
          <div className="text-sm text-muted-foreground">
            MultiChoice Group Limited © 2024
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
