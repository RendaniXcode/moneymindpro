
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Bot,
  TrendingUp,
  BarChart3,
  FileText,
  ChevronRight,
  Brain,
  Sparkles
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Money Mind Dashboard Pro
            </h1>
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          AI-Powered Financial Analysis in Under 5 Minutes
        </h2>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Harness advanced machine learning models to automate credit scoring, risk profiling, and financial statement analysis. Save hours of manual work with intelligent automation.
        </p>

        <Link to="/dashboard">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
            Start Analyzing Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Key Benefits */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
            </div>
            <p className="text-gray-600">Complete financial analysis in under 5 minutes - what used to take hours now happens instantly</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="h-8 w-8 text-purple-600" />
              <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
            </div>
            <p className="text-gray-600">Advanced ML models for credit scoring and risk profiling with institutional-grade accuracy</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <h3 className="text-xl font-semibold">Better Decisions</h3>
            </div>
            <p className="text-gray-600">Make data-driven investment decisions with comprehensive automated analysis</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Intelligent Features</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="flex items-start gap-4 p-4 rounded-lg">
            <div className="mt-1">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">AI Financial Statement Analysis</h3>
              <p className="text-gray-600">Automatically extract and analyze key metrics from financial statements in seconds</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg">
            <div className="mt-1">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">ML-Powered Credit Scoring</h3>
              <p className="text-gray-600">Advanced machine learning models for accurate credit risk assessment</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg">
            <div className="mt-1">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Interactive Visualizations</h3>
              <p className="text-gray-600">Dynamic charts and graphs that make complex data easy to understand</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg">
            <div className="mt-1">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Automated Risk Profiling</h3>
              <p className="text-gray-600">Comprehensive risk assessment reports generated automatically</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mx-auto max-w-5xl mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Save Hours of Analysis Time?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join financial analysts and investment managers who are already using AI to make better decisions faster.
            </p>
            <Link to="/dashboard">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Get Started with AI Analysis
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
