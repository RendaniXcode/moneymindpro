
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { processS3UploadedData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/dashboard/DataTable';
import MetricCard from '@/components/dashboard/MetricCard';
import InsightsCard from '@/components/dashboard/InsightsCard';
import CategoryFilter from '@/components/dashboard/CategoryFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Download, CalendarRange } from 'lucide-react';

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [financialData, setFinancialData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchMetric, setSearchMetric] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  
  // Handle data from file upload
  const handleUploadComplete = (data: any) => {
    if (!data) return;
    
    try {
      const processedData = processS3UploadedData(data);
      if (processedData) {
        setFinancialData(processedData);
        toast({
          title: 'Financial data loaded',
          description: `Successfully processed data from ${data.company || 'uploaded file'}`,
        });
      }
    } catch (error) {
      console.error('Error processing uploaded data:', error);
      toast({
        title: 'Error processing data',
        description: 'The uploaded file could not be processed correctly.',
        variant: 'destructive',
      });
    }
  };
  
  // For demonstration purposes, set default categories if none in data
  const categories = financialData?.categories?.length > 0 
    ? ['all', ...financialData.categories] 
    : ['all', 'liquidity_ratios', 'profitability_ratios', 'solvency_ratios'];
    
  const totalRecords = financialData?.data?.length || 0;
  const categoriesCount = financialData?.categories?.length || 0;

  const resetToAPIData = () => {
    // Reset the financial data
    setFinancialData(null);
    toast({
      title: 'Reset to API Data',
      description: 'Dashboard has been reset to use API data',
    });
  };
  
  const applyFilters = () => {
    // Apply filters logic would go here
    toast({
      title: 'Filters Applied',
      description: 'The dashboard has been filtered according to your criteria',
    });
  };
  
  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchMetric('');
    setMinValue('');
    setMaxValue('');
    toast({
      title: 'Filters Reset',
      description: 'All filters have been cleared',
    });
  };

  return (
    <DashboardLayout onUploadComplete={handleUploadComplete}>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Financial Analysis & Key Performance Metrics - Generated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
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
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
              <Input 
                placeholder="Minimum value" 
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
              <Input 
                placeholder="Maximum value" 
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={applyFilters} className="bg-blue-500 hover:bg-blue-600">Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4 border">
              <h4 className="text-sm text-gray-500 mb-1">Total Records</h4>
              <div className="text-2xl font-bold">{totalRecords}</div>
            </Card>
            <Card className="p-4 border">
              <h4 className="text-sm text-gray-500 mb-1">Categories</h4>
              <div className="text-2xl font-bold">{categoriesCount}</div>
            </Card>
            <Card className="p-4 border">
              <h4 className="text-sm text-gray-500 mb-1">Current Filter</h4>
              <div className="text-2xl font-bold">All Data</div>
              <div className="text-xs text-gray-500">Applied filter</div>
            </Card>
          </div>
        </Card>
        
        {financialData && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-green-800">Using uploaded financial data</h3>
                <p className="text-sm text-green-700">Showing data for {financialData.company || 'uploaded file'}</p>
              </div>
              <Button variant="outline" onClick={resetToAPIData}>Reset to API Data</Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border">
            <CardHeader>
              <CardTitle>DECLINED</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border">
            <CardHeader>
              <CardTitle>APPROVED</CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Profitability Trends</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="default" className="bg-blue-800">Line</Button>
                  <Button size="sm" variant="outline">Bar</Button>
                  <Button size="sm" variant="outline">Area</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] bg-gray-50 flex items-center justify-center">
              <p className="text-muted-foreground">Chart area (not implemented)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Liquidity Ratio Trend</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">Line</Button>
                  <Button size="sm" variant="outline">Bar</Button>
                  <Button size="sm" variant="default" className="bg-blue-800">Area</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] bg-gray-50 flex items-center justify-center">
              <p className="text-muted-foreground">Chart area (not implemented)</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Financial Ratios</CardTitle>
            <CardDescription>
              Detailed breakdown of financial metrics and ratios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {financialData ? (
              <DataTable 
                data={financialData.data || []} 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Upload financial statements to view detailed analysis
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex justify-end">
        <div className="text-sm text-muted-foreground">
          MoneyMind Pro v1.0
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
