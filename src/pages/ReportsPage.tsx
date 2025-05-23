import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { formatCategoryName, formatMetricName } from '@/hooks/useFinancialData';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Download, TrendingUp, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import ReportDetails from '@/components/reports/ReportDetails';
import { useReportsService } from '@/hooks/useReportsService';
import { validateAppSyncConnection } from '@/utils/validateAppSyncConnection';
import { debugAPIConfig } from '@/config/api.config';
import { useEffect } from 'react';

const ReportsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const { useReports, useReport } = useReportsService();
  
  // Fetch all reports with React Query
  const { 
    data: reports = [], 
    isLoading, 
    isError,
    error,
    refetch: refetchReports 
  } = useReports({
    // Configure caching and stale time
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    meta: {
      onError: (error: Error) => {
        console.error('Reports query error:', error);
        toast({
          title: "Error loading reports",
          description: error.message || "Failed to load reports. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  // Fetch selected report details
  const { 
    data: selectedReport, 
    isLoading: isLoadingReport,
    isError: isReportError
  } = useReport(selectedReportId, {
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  
  // Validate the AppSync connection on component mount with enhanced debugging
  useEffect(() => {
    const validateConnection = async () => {
      try {
        // Debug the API configuration first
        debugAPIConfig();
        
        console.log('Starting AppSync connection validation...');
        const { success, message } = await validateAppSyncConnection();
        
        if (!success) {
          console.error('AppSync validation failed:', message);
          toast({
            title: "Connection Issue",
            description: message,
            variant: "destructive",
          });
        } else {
          console.log("AppSync connection validated successfully:", message);
          toast({
            title: "Connection Successful",
            description: "AppSync connection established",
          });
        }
      } catch (error) {
        console.error("Error validating AppSync connection:", error);
        toast({
          title: "Connection Error",
          description: "Failed to validate AppSync connection",
          variant: "destructive",
        });
      }
    };
    
    validateConnection();
  }, [toast]);
  
  // Filter reports based on search term
  const filteredReports = reports.filter(report => 
    report.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
  };
  
  const handleExportReport = () => {
    if (!selectedReport) return;
    
    try {
      // Convert report to CSV
      const headers = ['Category', 'Metric', 'Value', 'Explanation'];
      const csvContent = [
        headers.join(','),
        ...selectedReport.ratios.map((row: any) => 
          [row.category, row.metric, row.value, `"${row.explanation}"`].join(',')
        )
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedReport.companyName}_credit_report.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Complete',
        description: 'Credit report has been exported to CSV',
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Export Failed",
        description: "Could not export the report to CSV",
        variant: "destructive",
      });
    }
  };

  // Render error state for reports list
  const renderReportsList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Loading reports...</p>
        </div>
      );
    }
    
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <div className="text-center">
            <p className="font-medium">Failed to load reports</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "An unknown error occurred"}
            </p>
            <p className="text-xs text-red-600 mt-2">
              Check console for detailed error information
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetchReports()}>
            Try Again
          </Button>
        </div>
      );
    }
    
    if (filteredReports.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No reports found
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {filteredReports.map((report) => (
          <div 
            key={report.reportId}
            onClick={() => handleSelectReport(report.reportId)}
            className={`p-3 rounded-md cursor-pointer border transition-all ${
              selectedReportId === report.reportId
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{report.companyName}</h4>
                <div className="text-sm text-muted-foreground">
                  {new Date(report.date).toLocaleDateString()}
                </div>
              </div>
              <Badge className={report.creditScore >= 70 ? 'bg-green-100 text-green-800' : 
                                report.creditScore >= 50 ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'}>
                {report.creditScore}
              </Badge>
            </div>
            <div className="flex mt-2 gap-2">
              <Badge variant="outline" className="text-xs">
                {report.industry}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {report.year}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render report details or empty/loading state
  const renderReportDetails = () => {
    if (!selectedReportId) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No Report Selected</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Select a company from the list to view credit analysis details and recommendations.
          </p>
        </div>
      );
    }
    
    if (isLoadingReport) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">Loading report details...</p>
          </div>
        </div>
      );
    }
    
    if (isReportError || !selectedReport) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-3">
          <AlertCircle className="h-12 w-12 text-red-600" />
          <div className="text-center">
            <p className="font-medium">Failed to load report</p>
            <p className="text-sm text-muted-foreground">Could not load the report details.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedReportId(selectedReportId)}>
            Try Again
          </Button>
        </div>
      );
    }
    
    return (
      <Tabs defaultValue="overview">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>{selectedReport.companyName}</CardTitle>
          </div>
          <CardDescription>
            {selectedReport.industry} | Report Date: {new Date(selectedReport.date).toLocaleDateString()}
          </CardDescription>
          <TabsList className="mt-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="pt-4">
          <TabsContent value="overview">
            <ReportDetails report={selectedReport} />
          </TabsContent>
          <TabsContent value="ratios">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Assessment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedReport.ratios.map((ratio: any, index: number) => {
                  const isPositive = ratio.assessment === 'positive';
                  const isNegative = ratio.assessment === 'negative';
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {formatCategoryName(ratio.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatMetricName(ratio.metric)}
                      </TableCell>
                      <TableCell className="text-right">
                        {ratio.value}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center ${
                          isPositive ? 'text-green-600' : 
                          isNegative ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {isPositive && <TrendingUp className="h-4 w-4 mr-1" />}
                          {isNegative && <TrendingDown className="h-4 w-4 mr-1" />}
                          {ratio.assessment === 'positive' ? 'Strong' : 
                           ratio.assessment === 'negative' ? 'Weak' : 'Neutral'}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="recommendations">
            <div className="space-y-4">
              {selectedReport.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader 
          title="Credit Analysis Reports" 
          subtitle="Historical credit analysis results"
          onExport={selectedReport ? handleExportReport : undefined}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reports List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Company Reports</CardTitle>
              <CardDescription>
                Select a company to view the credit analysis
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {renderReportsList()}
            </CardContent>
          </Card>
          
          {/* Report Details */}
          <Card className="md:col-span-2">
            {renderReportDetails()}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
