import React, { useState, useEffect } from 'react';
import { S3Client } from '@aws-sdk/client-s3';

const S3UploadTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

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

      // Create S3 client with IAM credentials
      if (accessKeyId && secretAccessKey) {
        const client = new S3Client({
          region: region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });
        console.log('Using IAM credentials');
        setStatus('AWS SDK v3 client created successfully');
        
        // Load files after successful credential test
        loadFiles();
      } else {
        throw new Error('AWS credentials not provided');
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };
  
  const loadFiles = async () => {
    try {
      setLoadingFiles(true);
      setError(''); // Clear previous errors
      
      console.log('Importing S3 service...');
      const { s3Service } = await import('@/services/s3Service');
      console.log('S3 service imported successfully');
      
      // Load files from financial-statements folder first
      console.log('Loading files from financial-statements folder...');
      let allFiles = [];
      
      try {
        const financialDocs = await s3Service.listFiles('financial-statements');
        allFiles = [...financialDocs];
        console.log('Financial documents loaded:', financialDocs.length);
      } catch (folderError) {
        console.error('Error loading financial documents:', folderError);
      }
      
      // Try other folders
      try {
        const testUploads = await s3Service.listFiles('test-uploads');
        allFiles = [...allFiles, ...testUploads];
        console.log('Test uploads loaded:', testUploads.length);
      } catch (folderError) {
        console.log('No test uploads found or error:', folderError);
      }
      
      try {
        const rootFiles = await s3Service.listFiles('');
        // Filter out folders, only include actual files
        const actualFiles = rootFiles.filter(file => !file.key.endsWith('/'));
        allFiles = [...allFiles, ...actualFiles];
        console.log('Root files loaded:', actualFiles.length);
      } catch (folderError) {
        console.log('No root files found or error:', folderError);
      }
      
      console.log('All files from S3:', allFiles);
      setFiles(allFiles);
      
      if (allFiles.length > 0) {
        setStatus(`Found ${allFiles.length} files in your S3 bucket`);
      } else {
        setStatus('No files found in your S3 bucket');
      }
    } catch (error) {
      console.error('Error loading files:', error);
      const errorMessage = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : 'Failed to load files from S3';
      setError(errorMessage);
      
      // Add more detailed debugging for errors
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
    } finally {
      setLoadingFiles(false);
    }
  };
  
  // Load files on component mount
  useEffect(() => {
    // Wait a bit to ensure the page has loaded
    const timer = setTimeout(() => {
      testAWSCredentials();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">S3 Upload Test</h2>

        <div className="flex space-x-2 mb-4">
          <button
              onClick={testAWSCredentials}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loadingFiles}
          >
            Test AWS Credentials
          </button>
          
          <button
              onClick={loadFiles}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={loadingFiles}
          >
            {loadingFiles ? 'Loading...' : 'Refresh Files'}
          </button>
        </div>

        {status && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
              {status}
            </div>
        )}

        {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
        )}
        
        {/* Display files list */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Files in S3 Bucket</h3>
          
          {loadingFiles ? (
            <div className="text-center p-4 border rounded">
              Loading files...
            </div>
          ) : files.length > 0 ? (
            <div className="border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {file.name}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {file.key}
                      </td>
                      <td className="px-4 py-2 text-sm text-right text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center border rounded p-4">
              No files found in your S3 bucket
            </div>
          )}
        </div>
      </div>
  );
};

export default S3UploadTest;