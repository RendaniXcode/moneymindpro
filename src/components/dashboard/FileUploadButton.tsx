
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileUploadButtonProps {
  onUploadComplete?: (data: any) => void;
  className?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onUploadComplete, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setStatus('uploading');

    // Process different file types
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (fileExtension === 'json') {
        // Handle JSON files
        processJsonFile(file);
      } else if (['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
        // For demo, we'll convert all tabular data formats to a similar JSON structure
        simulateTabularDataProcessing(file);
      } else if (['pdf', 'txt', 'doc', 'docx'].includes(fileExtension || '')) {
        // For demo, simulate document processing to extract financial data
        simulateDocumentProcessing(file);
      } else {
        throw new Error("Unsupported file format");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus('error');
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "There was a problem uploading your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const processJsonFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result === 'string') {
          const parsedData = JSON.parse(event.target.result);
          handleUploadSuccess(parsedData);
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        setStatus('error');
        toast({
          title: "Invalid Format",
          description: "The JSON file could not be processed. Please ensure it's a valid financial statement.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  const simulateTabularDataProcessing = (file: File) => {
    // In a real implementation, you would parse CSV/Excel data here
    // For demo purposes, we'll just generate dummy financial data
    const dummyData = {
      company: file.name.split('.')[0],
      year: "2024",
      generated_at: new Date().toISOString(),
      report: {
        executive_summary: "Financial data extracted from tabular data file.",
        financial_ratios: generateDummyRatios(),
        key_insights: [
          "Extracted from tabular data file",
          "Showing simulated data for demo purposes",
          `Processed ${file.name} successfully`
        ],
        recommendations: [
          "Analyze tabular data in detail",
          "Consider using standardized templates",
          "Review underlying calculations"
        ]
      }
    };
    
    handleUploadSuccess(dummyData);
  };

  const simulateDocumentProcessing = (file: File) => {
    // In a real implementation, you would use document parsing services
    // For demo purposes, we'll just generate dummy financial data
    const dummyData = {
      company: file.name.split('.')[0],
      year: "2024",
      generated_at: new Date().toISOString(),
      report: {
        executive_summary: `Extracted data from ${file.name}`,
        financial_ratios: generateDummyRatios(),
        key_insights: [
          `Extracted from ${file.name}`,
          "Document processed using simulated AI extraction",
          "Financial metrics extracted from textual content"
        ],
        recommendations: [
          "Review extracted data for accuracy",
          "Consider using structured templates for better extraction",
          "Provide more detailed financial statements for better analysis"
        ]
      }
    };
    
    handleUploadSuccess(dummyData);
  };

  const generateDummyRatios = () => {
    // Generate dummy financial ratios for demo
    return {
      liquidity_ratios: {
        current_ratio: { value: 1.5, explanation: "Extracted from document" },
        quick_ratio: { value: 1.2, explanation: "Extracted from document" },
        cash_ratio: { value: 0.5, explanation: "Extracted from document" },
        operating_cash_flow_ratio: { value: 0.8, explanation: "Extracted from document" }
      },
      profitability_ratios: {
        gross_profit_margin: { value: 35, explanation: "Extracted from document" },
        operating_profit_margin: { value: 15, explanation: "Extracted from document" },
        net_profit_margin: { value: 10, explanation: "Extracted from document" },
        return_on_assets: { value: 8, explanation: "Extracted from document" },
        return_on_equity: { value: 12, explanation: "Extracted from document" }
      },
      solvency_ratios: {
        debt_to_equity_ratio: { value: 1.2, explanation: "Extracted from document" },
        debt_to_assets_ratio: { value: 0.4, explanation: "Extracted from document" },
        interest_coverage_ratio: { value: 4.5, explanation: "Extracted from document" },
        debt_service_coverage_ratio: { value: 1.5, explanation: "Extracted from document" }
      },
      efficiency_ratios: {
        asset_turnover_ratio: { value: 0.7, explanation: "Extracted from document" },
        inventory_turnover_ratio: { value: 5.2, explanation: "Extracted from document" },
        receivables_turnover_ratio: { value: 8.1, explanation: "Extracted from document" },
        payables_turnover_ratio: { value: 7.3, explanation: "Extracted from document" }
      },
      market_value_ratios: {
        earnings_per_share: { value: 2.5, explanation: "Extracted from document" },
        price_to_earnings_ratio: { value: 18.2, explanation: "Extracted from document" },
        price_to_book_ratio: { value: 2.8, explanation: "Extracted from document" },
        dividend_yield: { value: 2.1, explanation: "Extracted from document" }
      }
    };
  };

  const handleUploadSuccess = (data: any) => {
    // Call the callback with the parsed data
    if (onUploadComplete) {
      onUploadComplete(data);
    }
    
    setStatus('success');
    toast({
      title: "Upload Successful",
      description: `${file?.name} has been processed successfully`,
    });
    
    // Close the dialog after a brief delay
    setTimeout(() => {
      setIsOpen(false);
      setFile(null);
      setStatus('idle');
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${className}`}
          onClick={() => setIsOpen(true)}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Statements</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Financial Statements</DialogTitle>
          <DialogDescription>
            Upload your financial statements to analyze and display on the dashboard.
            Supported formats: JSON, CSV, Excel, PDF, TXT, DOC, DOCX
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Financial Statement File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".json,.csv,.xlsx,.xls,.pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                disabled={status === 'uploading'}
                className="flex-1"
              />
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={status === 'uploading'}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || status === 'uploading'}
            className="relative"
          >
            {status === 'uploading' ? (
              <>
                <span className="animate-pulse">Processing...</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                </span>
              </>
            ) : status === 'success' ? (
              "Uploaded!"
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadButton;
