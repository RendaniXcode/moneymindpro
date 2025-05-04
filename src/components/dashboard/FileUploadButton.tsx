import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileUp, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { s3Service } from '@/services/s3Service';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileUploadButtonProps {
  onUploadComplete?: (data: any) => void;
  className?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onUploadComplete, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Define the maximum file size (20MB in bytes)
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file size exceeds limit
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 20MB",
          variant: "destructive",
        });
        e.target.value = ''; // Reset the input
        return;
      }
      
      setFile(selectedFile);
      setUploadProgress(0);
      setStatus('idle');
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
    
    // Double-check file size before uploading
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    setStatus('uploading');
    setUploadProgress(0);

    try {
      // Upload to S3
      const result = await s3Service.uploadFile(
          file,
          'financial-statements', // Folder in your bucket
          (progress) => {
            setUploadProgress(progress);
          }
      );

      // Call the callback with S3 upload result
      if (onUploadComplete) {
        onUploadComplete({
          fileName: file.name,
          s3Location: result.Location,
          bucket: result.Bucket,
          key: result.Key,
          etag: result.ETag
        });
      }

      setStatus('success');
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded to S3`,
      });

      // Reset after delay
      setTimeout(() => {
        setIsOpen(false);
        setFile(null);
        setStatus('idle');
        setUploadProgress(0);
      }, 2000);

    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus('error');
      
      // Check for various common errors
      const isCorsError = 
        error instanceof Error && 
        (error.message.includes("NetworkError") || 
         error.message.includes("Network Error") ||
         error.message.includes("CORS"));
         
      const isChecksumError = 
        error instanceof Error && 
        (error.message.includes("checksum") ||
         error.message.includes("readableStream") ||
         error.message.includes("getReader"));
      
      let errorMessage = "There was a problem uploading your file.";
      
      if (isCorsError) {
        errorMessage = "CORS error: S3 bucket is not configured to accept uploads from this domain. Please check README.md for CORS configuration instructions.";
      } else if (isChecksumError) {
        errorMessage = "The file couldn't be uploaded due to a compatibility issue with the AWS SDK. Please try a different file or contact support.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
    
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3 ${className}`}
          onClick={() => setIsOpen(true)}
        >
          <Upload className="h-5 w-5" />
          <span className="text-base">Upload Files</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Select a file to upload for financial analysis. Maximum file size: 20MB.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file" className="mb-1">Select File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                disabled={status === 'uploading'}
                className="flex-1"
              />
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected file: {file.name} ({file.size > 1024 * 1024 
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
                  : `${Math.round(file.size / 1024)} KB`})
              </p>
            )}

            {status === 'uploading' && (
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-200 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-center mt-1 text-muted-foreground">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="mt-4 flex items-center justify-center flex-col">
                <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                <p className="text-sm font-medium text-green-600">Upload Successful!</p>
              </div>
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
            disabled={!file || status === 'uploading' || status === 'success'}
          >
            {status === 'uploading' ? (
              <span className="animate-pulse">Uploading...</span>
            ) : status === 'success' ? (
              "Done"
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