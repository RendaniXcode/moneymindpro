import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadProgress(0);
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
      }, 1000);

    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus('error');
      
      // Check for CORS-related errors
      const isCorsError = 
        error instanceof Error && 
        (error.message.includes("NetworkError") || 
         error.message.includes("Network Error") ||
         error.message.includes("CORS"));
      
      toast({
        title: "Upload Failed",
        description: isCorsError 
          ? "CORS error: S3 bucket is not configured to accept uploads from this domain. Please check README.md for CORS configuration instructions."
          : (error instanceof Error ? error.message : "There was a problem uploading your file."),
        variant: "destructive",
      });
    }
  };

    const [files, setFiles] = useState<any[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    
    // Function to load files from the same folder
    const loadFiles = async () => {
      try {
        setLoadingFiles(true);
        const filesList = await s3Service.listFiles('financial-statements');
        setFiles(filesList);
        console.log('Files in S3:', filesList);
      } catch (error) {
        console.error('Error loading files:', error);
        toast({
          title: "Error loading files",
          description: error instanceof Error ? error.message : "Failed to load files from S3",
          variant: "destructive",
        });
      } finally {
        setLoadingFiles(false);
      }
    };
    
    // Load files when the dialog opens
    React.useEffect(() => {
      if (isOpen) {
        loadFiles();
      }
    }, [isOpen]);
    
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
              <DialogTitle>Upload File to S3</DialogTitle>
              <DialogDescription>
                Select a file to upload to your S3 bucket.
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
                      Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
                    </p>
                )}
  
                {status === 'uploading' && (
                    <div className="mt-2">
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
              </div>
              
              {/* Show existing files */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Files in S3 Bucket</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadFiles} 
                    disabled={loadingFiles}
                    className="h-8 px-2 text-xs"
                  >
                    {loadingFiles ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>
                
                {loadingFiles ? (
                  <div className="text-center p-4 text-sm text-muted-foreground">
                    Loading files...
                  </div>
                ) : files.length > 0 ? (
                  <div className="border rounded-md mt-1 max-h-40 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {files.map((file, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-xs">
                              <a 
                                href={file.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {file.name}
                              </a>
                            </td>
                            <td className="px-3 py-2 text-right text-xs text-gray-500">
                              {Math.round(file.size / 1024)} KB
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center border rounded-md p-4 text-sm text-muted-foreground">
                    No files found
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
                disabled={!file || status === 'uploading'}
            >
              {status === 'uploading' ? (
                  <span className="animate-pulse">Uploading...</span>
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