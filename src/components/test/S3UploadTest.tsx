import React, { useState, useEffect, useRef } from 'react';
import { S3Client } from '@aws-sdk/client-s3';
import { CheckCircle, Upload } from 'lucide-react';
import { s3Service } from '@/services/s3Service';

const S3UploadTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const testAWSCredentials = async () => {
    try {
      console.log("Testing AWS SDK v3 credentials...");

      const getEnvVar = (key: string, defaultValue = '') => {
        return import.meta.env[key] || defaultValue;
      };

      const bucket = getEnvVar('VITE_AWS_S3_BUCKET');
      const region = getEnvVar('VITE_AWS_REGION');
      const accessKeyId = getEnvVar('VITE_AWS_ACCESS_KEY_ID');
      const secretAccessKey = getEnvVar('VITE_AWS_SECRET_ACCESS_KEY');

      console.log('Environment variables:');
      console.log('- Bucket:', bucket);
      console.log('- Region:', region);
      console.log('- Access Key ID:', accessKeyId ? 'Provided' : 'Not provided');
      console.log('- Secret Access Key:', secretAccessKey ? 'Provided' : 'Not provided');

      // Validate all required credentials
      if (!accessKeyId || !secretAccessKey || !region || !bucket) {
        throw new Error('Missing required AWS configuration');
      }

      // Create and test S3 client with IAM credentials
      const client = new S3Client({
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });

      // Verify client creation
      console.log('Using IAM credentials');
      setStatus('AWS SDK v3 client created successfully');

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadProgress(0);
      setUploadSuccess(false);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError('');

      console.log('Using S3 service...');

      // Upload the file to S3
      await s3Service.uploadFile(
          selectedFile,
          'test-uploads',
          (progress) => {
            setUploadProgress(progress);
          }
      );

      setUploadSuccess(true);
      setStatus(`Successfully uploaded ${selectedFile.name}`);

      // Clear file after 2 seconds
      setTimeout(() => {
        setSelectedFile(null);
        setUploadSuccess(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);

    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error
          ? `${error.name}: ${error.message}`
          : 'Failed to upload file to S3';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Test credentials on component mount
  useEffect(() => {
    // Wait a bit to ensure the page has loaded
    const timer = setTimeout(() => {
      testAWSCredentials();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">S3 Upload Test</h2>

        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="mb-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Select a file to upload
            </label>
            <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                disabled={isUploading}
            />
          </div>

          {selectedFile && (
              <div className="text-sm text-gray-600 mb-4">
                Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </div>
          )}

          {isUploading && (
              <div className="mb-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                      className="h-full bg-blue-500 transition-all duration-200 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="text-xs text-center mt-1 text-gray-500">
                  Uploading: {uploadProgress}%
                </div>
              </div>
          )}

          {uploadSuccess && (
              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span>Upload successful!</span>
              </div>
          )}

          <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || uploadSuccess}
              className={`w-full flex items-center justify-center gap-2 ${
                  !selectedFile || isUploading || uploadSuccess
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
              } text-white py-2 px-4 rounded transition-colors`}
          >
            {isUploading ? (
                <span className="animate-pulse">Uploading...</span>
            ) : uploadSuccess ? (
                <span>Uploaded!</span>
            ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </>
            )}
          </button>
        </div>

        {status && !uploadSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
              {status}
            </div>
        )}

        {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded">
          <h3 className="text-sm font-medium text-blue-800 mb-1">AWS Configuration Status</h3>
          <button
              onClick={testAWSCredentials}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mb-2"
          >
            Test AWS Credentials
          </button>
          <p className="text-xs text-blue-700">
            This test tool helps verify your AWS configuration is working correctly.
          </p>
        </div>
      </div>
  );
};

export default S3UploadTest;