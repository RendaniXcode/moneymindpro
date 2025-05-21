
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

// Type definitions
export interface Report {
  reportId: string;
  companyName: string;
  industry: string;
  date: string;
  year: string;
  creditScore: number;
  ratios: FinancialRatio[];
  insights: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  trends: {
    revenue: number[];
    profit: number[];
    debt: number[];
  };
  companyProfile: string;
}

export interface FinancialRatio {
  category: string;
  metric: string;
  value: string | number;
  explanation: string;
  assessment: 'positive' | 'negative' | 'neutral';
}

export const useReportsService = () => {
  // In a real application, this would fetch from an API
  // For now, we'll use mock data
  const fetchReports = async (): Promise<Report[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        reportId: 'rep-2024-001',
        companyName: 'MultiChoice Group',
        industry: 'Media & Entertainment',
        date: '2024-04-15',
        year: '2024',
        creditScore: 82,
        ratios: [],
        insights: [],
        recommendations: [],
        riskLevel: 'low',
        trends: { revenue: [45, 47, 52, 58, 62], profit: [12, 14, 15, 18, 20], debt: [30, 28, 25, 22, 20] },
        companyProfile: 'MultiChoice Group is a leading entertainment company in Africa with operations across satellite TV, streaming services, and content development.'
      },
      {
        reportId: 'rep-2024-002',
        companyName: 'Sasol Limited',
        industry: 'Energy & Chemicals',
        date: '2024-03-22',
        year: '2024',
        creditScore: 68,
        ratios: [],
        insights: [],
        recommendations: [],
        riskLevel: 'medium',
        trends: { revenue: [60, 58, 62, 65, 67], profit: [18, 16, 17, 19, 18], debt: [35, 38, 40, 42, 40] },
        companyProfile: 'Sasol Limited is an integrated energy and chemical company based in South Africa. The company develops and commercializes technologies, and builds and operates facilities to produce various product streams.'
      },
      {
        reportId: 'rep-2024-003',
        companyName: 'MTN Group',
        industry: 'Telecommunications',
        date: '2024-02-10',
        year: '2024',
        creditScore: 75,
        ratios: [],
        insights: [],
        recommendations: [],
        riskLevel: 'low',
        trends: { revenue: [72, 78, 82, 85, 90], profit: [22, 24, 25, 26, 28], debt: [45, 42, 40, 38, 35] },
        companyProfile: 'MTN Group is a multinational mobile telecommunications company operating in many African and Asian countries. The company offers voice, data, digital, fintech, wholesale, and enterprise services.'
      },
      {
        reportId: 'rep-2023-004',
        companyName: 'Shoprite Holdings',
        industry: 'Retail',
        date: '2023-12-05',
        year: '2023',
        creditScore: 79,
        ratios: [],
        insights: [],
        recommendations: [],
        riskLevel: 'low',
        trends: { revenue: [65, 68, 72, 76, 80], profit: [15, 16, 18, 19, 20], debt: [20, 22, 24, 22, 20] },
        companyProfile: 'Shoprite Holdings is Africa\'s largest food retailer operating supermarkets, hypermarkets, and convenience stores across multiple African countries.'
      },
      {
        reportId: 'rep-2023-005',
        companyName: 'FirstRand Limited',
        industry: 'Banking & Financial Services',
        date: '2023-11-15',
        year: '2023',
        creditScore: 85,
        ratios: [],
        insights: [],
        recommendations: [],
        riskLevel: 'low',
        trends: { revenue: [55, 58, 62, 68, 72], profit: [25, 26, 28, 30, 32], debt: [65, 62, 60, 58, 55] },
        companyProfile: 'FirstRand Limited is one of the largest financial services groups in South Africa, providing banking, insurance and investment products and services.'
      },
      {
        reportId: 'rep-2023-006',
        companyName: 'Exxaro Resources',
        industry: 'Mining',
        date: '2023-10-03',
        year: '2023',
        creditScore: 48,
        ratios: [],
        insights: [],
        recommendations: [],
        riskLevel: 'high',
        trends: { revenue: [40, 38, 35, 32, 30], profit: [12, 10, 8, 6, 5], debt: [25, 28, 32, 35, 38] },
        companyProfile: 'Exxaro Resources is a large South African coal and heavy minerals mining company. The company produces coal, ferrous and energy commodities.'
      }
    ];
  };
  
  const getReportById = async (reportId: string): Promise<Report | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be an API call with the reportId
    // For this demo, we'll return mock data for the first report
    
    if (reportId === 'rep-2024-001') {
      return {
        reportId: 'rep-2024-001',
        companyName: 'MultiChoice Group',
        industry: 'Media & Entertainment',
        date: '2024-04-15',
        year: '2024',
        creditScore: 82,
        companyProfile: 'MultiChoice Group is a leading entertainment company in Africa with operations across satellite TV, streaming services, and content development.',
        ratios: [
          {
            category: 'liquidity_ratios',
            metric: 'current_ratio',
            value: '1.85',
            explanation: 'The company has strong short-term liquidity with current assets exceeding current liabilities.',
            assessment: 'positive'
          },
          {
            category: 'liquidity_ratios',
            metric: 'quick_ratio',
            value: '1.42',
            explanation: 'The company can meet short-term obligations without relying on inventory.',
            assessment: 'positive'
          },
          {
            category: 'profitability_ratios',
            metric: 'gross_profit_margin',
            value: '35.2%',
            explanation: 'Strong profit margin indicates efficient operational management.',
            assessment: 'positive'
          },
          {
            category: 'profitability_ratios',
            metric: 'operating_profit_margin',
            value: '18.4%',
            explanation: 'Above industry average operating efficiency.',
            assessment: 'positive'
          },
          {
            category: 'profitability_ratios',
            metric: 'return_on_assets',
            value: '12.7%',
            explanation: 'Good return on assets indicates effective use of company assets to generate profits.',
            assessment: 'positive'
          },
          {
            category: 'solvency_ratios',
            metric: 'debt_to_equity_ratio',
            value: '0.68',
            explanation: 'The company has a conservative debt structure with more equity than debt.',
            assessment: 'positive'
          },
          {
            category: 'solvency_ratios',
            metric: 'interest_coverage_ratio',
            value: '8.5',
            explanation: 'Company generates enough operating income to cover interest expenses multiple times.',
            assessment: 'positive'
          },
          {
            category: 'efficiency_ratios',
            metric: 'asset_turnover_ratio',
            value: '0.74',
            explanation: 'The company could improve efficiency in using assets to generate revenue.',
            assessment: 'neutral'
          },
          {
            category: 'efficiency_ratios',
            metric: 'inventory_turnover',
            value: '5.2',
            explanation: 'Moderate inventory turnover indicates potential for optimization.',
            assessment: 'neutral'
          },
          {
            category: 'market_value_ratios',
            metric: 'price_to_earnings',
            value: '14.8',
            explanation: 'P/E ratio is reasonable compared to industry peers, suggesting fair valuation.',
            assessment: 'neutral'
          },
        ],
        insights: [
          'MultiChoice Group demonstrates strong financial health with robust liquidity and solvency positions.',
          "The company's profitability metrics outperform industry averages, particularly in operating profit margin.",
          'Consistently improving revenue trends indicate successful market penetration and product adoption.',
          'The debt structure is sustainable with a conservative debt-to-equity ratio of 0.68.',
          'Strong cash flow generation supports ongoing investments in content and technology infrastructure.'
        ],
        recommendations: [
          'Consider optimizing inventory management to improve the inventory turnover ratio.',
          'Maintain the current debt management strategy as it provides a good balance between leverage and financial stability.',
          'Explore opportunities to improve asset utilization to enhance the asset turnover ratio.',
          'Continue investing in high-return content production to maintain competitive advantage.',
          'Consider strategic acquisitions in emerging markets to diversify revenue streams.'
        ],
        riskLevel: 'low',
        trends: {
          revenue: [45, 47, 52, 58, 62],
          profit: [12, 14, 15, 18, 20],
          debt: [30, 28, 25, 22, 20]
        }
      };
    } else if (reportId === 'rep-2024-002') {
      return {
        reportId: 'rep-2024-002',
        companyName: 'Sasol Limited',
        industry: 'Energy & Chemicals',
        date: '2024-03-22',
        year: '2024',
        creditScore: 68,
        companyProfile: 'Sasol Limited is an integrated energy and chemical company based in South Africa. The company develops and commercializes technologies, and builds and operates facilities to produce various product streams.',
        ratios: [
          {
            category: 'liquidity_ratios',
            metric: 'current_ratio',
            value: '1.25',
            explanation: 'Adequate but not strong short-term liquidity position.',
            assessment: 'neutral'
          },
          {
            category: 'liquidity_ratios',
            metric: 'quick_ratio',
            value: '0.92',
            explanation: 'The company may face challenges meeting short-term obligations without selling inventory.',
            assessment: 'negative'
          },
          {
            category: 'profitability_ratios',
            metric: 'gross_profit_margin',
            value: '28.6%',
            explanation: 'Profit margins are under pressure due to volatility in energy markets.',
            assessment: 'neutral'
          },
          {
            category: 'profitability_ratios',
            metric: 'operating_profit_margin',
            value: '12.3%',
            explanation: 'Operating efficiency is around industry average.',
            assessment: 'neutral'
          },
          {
            category: 'profitability_ratios',
            metric: 'return_on_assets',
            value: '7.4%',
            explanation: 'Below optimal return on assets indicates challenges in asset utilization.',
            assessment: 'negative'
          },
          {
            category: 'solvency_ratios',
            metric: 'debt_to_equity_ratio',
            value: '1.15',
            explanation: 'Higher debt levels increase financial risk, though still manageable.',
            assessment: 'negative'
          },
          {
            category: 'solvency_ratios',
            metric: 'interest_coverage_ratio',
            value: '4.2',
            explanation: 'Adequate but not strong ability to cover interest expenses.',
            assessment: 'neutral'
          }
        ],
        insights: [
          'Sasol is facing challenges in its liquidity position, particularly in quick ratio metrics.',
          "The company's higher debt-to-equity ratio of 1.15 increases financial risk exposure.",
          'Profitability metrics are showing moderate performance with room for improvement.',
          'Recent operational efficiency initiatives have helped stabilize operating margins.',
          'Exposure to commodity price volatility continues to impact financial performance.'
        ],
        recommendations: [
          'Implement strategies to reduce debt levels and improve the debt-to-equity ratio.',
          'Focus on improving working capital management to strengthen liquidity position.',
          'Consider divesting underperforming assets to improve return on assets.',
          'Develop hedging strategies to mitigate exposure to commodity price fluctuations.',
          'Explore opportunities in renewable energy to diversify revenue streams.'
        ],
        riskLevel: 'medium',
        trends: {
          revenue: [60, 58, 62, 65, 67],
          profit: [18, 16, 17, 19, 18],
          debt: [35, 38, 40, 42, 40]
        }
      };
    } else {
      // For other IDs, return simplified data to show the functionality
      const reports = await fetchReports();
      const report = reports.find(r => r.reportId === reportId);
      
      if (!report) return null;
      
      // Add some mock ratios and insights
      return {
        ...report,
        ratios: [
          {
            category: 'liquidity_ratios',
            metric: 'current_ratio',
            value: '1.45',
            explanation: 'Adequate liquidity position.',
            assessment: 'neutral'
          },
          {
            category: 'profitability_ratios',
            metric: 'operating_profit_margin',
            value: '15.2%',
            explanation: 'Good operating efficiency.',
            assessment: 'positive'
          },
          {
            category: 'solvency_ratios',
            metric: 'debt_to_equity_ratio',
            value: '0.85',
            explanation: 'Balanced debt structure.',
            assessment: 'positive'
          }
        ],
        insights: [
          'The company shows stable financial performance.',
          'Debt management is effective with balanced leverage.',
          'Profitability is in line with industry standards.'
        ],
        recommendations: [
          'Continue monitoring industry trends for potential market shifts.',
          'Maintain current capital structure as it provides good balance.',
          'Consider strategic investments to enhance market position.'
        ]
      };
    }
  };
  
  return {
    fetchReports,
    getReportById
  };
};
