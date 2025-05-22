
import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to the App</h1>
      <nav className="space-y-4">
        <Link to="/dashboard" className="block p-4 bg-blue-100 hover:bg-blue-200 rounded-md">
          Dashboard
        </Link>
        <Link to="/reports" className="block p-4 bg-green-100 hover:bg-green-200 rounded-md">
          Reports
        </Link>
        <Link to="/documents" className="block p-4 bg-purple-100 hover:bg-purple-200 rounded-md">
          Document Analysis
        </Link>
      </nav>
    </div>
  );
};

export default Index;
