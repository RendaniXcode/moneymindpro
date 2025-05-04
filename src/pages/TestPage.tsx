import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import S3UploadTest from '@/components/test/S3UploadTest';

// Safe environment variable display component
const EnvVarsDisplay: React.FC = () => {
  const [envVars, setEnvVars] = useState<Record<string, string>>({
    VITE_AWS_REGION: 'Loading...',
    VITE_AWS_S3_BUCKET: 'Loading...',
    VITE_AWS_ACCESS_KEY_ID: 'Loading...',
    VITE_AWS_SECRET_ACCESS_KEY: 'Loading...',
    VITE_ENABLE_S3_ACCELERATION: 'Loading...',
    VITE_AWS_S3_ACCELERATE_ENDPOINT: 'Loading...'
  });

  useEffect(() => {
    // Safely get environment variables with fallbacks
    const getEnvVar = (key: string, defaultValue: string = 'Not set') => {
      if (typeof import.meta.env === 'undefined') return defaultValue;
      return import.meta.env[key] || defaultValue;
    };

    // Update with actual values
    setEnvVars({
      VITE_AWS_REGION: getEnvVar('VITE_AWS_REGION'),
      VITE_AWS_S3_BUCKET: getEnvVar('VITE_AWS_S3_BUCKET'),
      VITE_AWS_ACCESS_KEY_ID: getEnvVar('VITE_AWS_ACCESS_KEY_ID') ? 'Set (hidden)' : 'Not set',
      VITE_AWS_SECRET_ACCESS_KEY: getEnvVar('VITE_AWS_SECRET_ACCESS_KEY') ? 'Set (hidden)' : 'Not set',
      VITE_ENABLE_S3_ACCELERATION: getEnvVar('VITE_ENABLE_S3_ACCELERATION') === 'true' ? 'Enabled' : 'Disabled',
      VITE_AWS_S3_ACCELERATE_ENDPOINT: getEnvVar('VITE_AWS_S3_ACCELERATE_ENDPOINT')
    });
  }, []);

  return (
    <div className="grid gap-2 text-sm text-yellow-700">
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key}>
          <span className="font-medium">{key.replace('VITE_', '')}:</span> {value}
        </div>
      ))}
    </div>
  );
};

const TestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Environment</h1>
      
      <div className="grid gap-8">
        <div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>AWS S3 Upload Test</CardTitle>
              <CardDescription>
                Test direct file uploads to AWS S3 with progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <S3UploadTest />
            </CardContent>
          </Card>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-medium text-yellow-800 mb-2">Environment Variables Loaded:</h3>
            <EnvVarsDisplay />
            
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <h4 className="font-medium text-red-800 mb-2">⚠️ S3 CORS Configuration Required</h4>
              <p className="text-sm text-red-700">
                If you experience CORS errors when uploading files, you need to configure CORS on your S3 bucket.
                See the README.md file for instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
