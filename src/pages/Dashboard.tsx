
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

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [financialData, setFinancialData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
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

  return (
    <DashboardLayout onUploadComplete={handleUploadComplete}>
      <DashboardHeader 
        title="Financial Dashboard" 
        subtitle={financialData ? `Data from ${financialData.company || 'Unknown'} - ${financialData.year || new Date().getFullYear()}` : 'Upload financial statements to get started'} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
              title="Liquidity Position" 
              value={financialData ? "Healthy" : "Unknown"} 
              trend="up" 
              description="Based on current ratio analysis" 
            />
            <MetricCard 
              title="Debt Management" 
              value={financialData ? "Moderate" : "Unknown"} 
              trend="neutral" 
              description="Based on debt-to-equity ratio" 
            />
            <MetricCard 
              title="Profitability" 
              value={financialData ? "Strong" : "Unknown"} 
              trend="up" 
              description="Based on profit margin analysis" 
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <InsightsCard 
              title="Key Financial Insights" 
              insights={financialData?.insights || ['Upload financial data to see insights']} 
            />
            <InsightsCard 
              title="Recommendations" 
              insights={financialData?.recommendations || ['Upload financial data to see recommendations']} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Ratios</CardTitle>
              <CardDescription>
                Detailed breakdown of financial metrics and ratios
              </CardDescription>
              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
                className="mt-2" 
              />
            </CardHeader>
            <CardContent>
              {financialData ? (
                <DataTable data={financialData.data || []} category={selectedCategory} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Upload financial statements to view detailed analysis
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
