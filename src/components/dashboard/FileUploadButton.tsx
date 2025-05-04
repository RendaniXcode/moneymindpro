
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
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onUploadComplete }) => {
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

    // Here we would normally upload to a real API
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Assuming the file is a JSON representation of financial data
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (typeof event.target?.result === 'string') {
            const parsedData = JSON.parse(event.target.result);
            
            // Call the callback with the parsed data
            if (onUploadComplete) {
              onUploadComplete(parsedData);
            }
            
            setStatus('success');
            toast({
              title: "Upload Successful",
              description: "Financial statements have been uploaded successfully",
            });
            
            // Close the dialog after a brief delay
            setTimeout(() => {
              setIsOpen(false);
              setFile(null);
              setStatus('idle');
            }, 1000);
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          setStatus('error');
          toast({
            title: "Invalid Format",
            description: "The file could not be processed. Please ensure it's a valid JSON financial statement.",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus('error');
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
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
            Upload your financial statements as JSON to analyze and display on the dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Financial Statement File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".json"
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
                <span className="animate-pulse">Uploading...</span>
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
