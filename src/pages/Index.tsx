
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

const Index = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Money Mind Dashboard Pro</h1>
      
      <div className="grid gap-6">
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Financial data analysis</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Interactive charts and graphs</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Photo albums with AWS S3 integration</span>
            </li>
          </ul>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/dashboard">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Link to="/albums">
            <Button className="w-full flex items-center justify-center gap-2">
              <Camera className="h-4 w-4" />
              <span>Photo Albums</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
