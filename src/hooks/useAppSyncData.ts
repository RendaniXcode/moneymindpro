
import { useQuery, useMutation } from '@tanstack/react-query';
import { ApolloClient, InMemoryCache, HttpLink, split, gql, ApolloLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createAuthLink } from 'aws-appsync-auth-link';
import { Sha256 } from '@aws-crypto/sha256-js';
import { Report } from './useReportsService';
import { API_CONFIG } from '@/config/api.config';
import { 
  parseDynamoDBItem, 
  formatFinancialRatios, 
  formatPerformanceTrends,
  formatRecommendations 
} from '@/utils/dynamoDBParser';

// Define the global object for aws-appsync-auth-link compatibility
if (typeof window !== 'undefined' && !window.global) {
  (window as any).global = window;
}

// Define credit decision enum
export type CreditDecision = 'APPROVED' | 'REJECTED' | 'PENDING' | 'REVIEW';

// Define the FinancialReports interface based on your new schema
export interface FinancialReports {
  companyId: string;
  reportDate: string;
  companyName?: string;
  industry?: string;
  creditScore?: number;
  creditDecision: string;
  reportStatus?: string;
  lastUpdated?: string;
  financialRatios?: string;
  recommendations?: string;
  performanceTrends?: string;
}

// Create Apollo Client instance with API key authentication and proper error handling
const createApolloClient = () => {
  // Get API key and endpoints from environment variables or config
  const apiKey = API_CONFIG.APPSYNC.apiKey;
  
  // Log configuration info (for debugging) - safely
  console.log('AppSync Configuration:');
  console.log('- API Key provided:', apiKey ? 'Yes' : 'No');
  
  // Define endpoints from config
  const httpEndpoint = API_CONFIG.APPSYNC.endpoint;
  const wsEndpoint = httpEndpoint.replace('https://', 'wss://').replace('/graphql', '/graphql');
  
  // Create auth link using aws-appsync-auth-link
  const authLink = createAuthLink({
    url: httpEndpoint,
    region: API_CONFIG.APPSYNC.region,
    auth: {
      type: 'API_KEY',
      apiKey
    },
    ...(({ disableOffline: true, SHA256: Sha256 } as any))
  });
  
  // HTTP link
  const httpLink = new HttpLink({
    uri: httpEndpoint
  });
  
  // WebSocket link for real-time subscriptions with auth
  const wsLink = new GraphQLWsLink(createClient({
    url: wsEndpoint,
    connectionParams: {
      'x-api-key': apiKey
    }
  }));
  
  // Error handling link
  const errorLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      if (response.errors && response.errors.length > 0) {
        console.error('GraphQL Errors:', response.errors);
        response.errors.forEach((err) => {
          const errorCode = err.extensions?.code;
          if (errorCode === 'UNAUTHENTICATED') {
            console.error('Authentication error. Check your API key.');
          }
        });
      }
      return response;
    });
  });
  
  // Use split to route operations based on their type
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );
  
  // Combine links with auth and error handling
  const link = ApolloLink.from([
    errorLink,
    authLink,
    splitLink
  ]);
  
  // Create and return Apollo client with optimized cache settings
  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            listFinancialReports: {
              keyArgs: ['filter'],
              merge(existing = { items: [] }, incoming) {
                return {
                  ...incoming,
                  items: [
                    ...existing.items,
                    ...incoming.items
                  ]
                };
              }
            }
          }
        }
      }
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    },
    connectToDevTools: import.meta.env.DEV
  });
};

// Create a singleton instance to be used throughout the app
let apolloClient: ApolloClient<any> | null = null;

// Initialize client on demand to ensure environment variables are loaded
const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
};

// Updated GraphQL query definitions based on your new schema
const GET_FINANCIAL_REPORTS = gql`
  query GetFinancialReports($companyId: String!, $reportDate: String!) {
    getFinancialReports(companyId: $companyId, reportDate: $reportDate) {
      companyId
      reportDate
      companyName
      industry
      creditScore
      creditDecision
      reportStatus
      lastUpdated
      financialRatios
      recommendations
      performanceTrends
    }
  }
`;

const LIST_FINANCIAL_REPORTS = gql`
  query ListFinancialReports($filter: TableFinancialReportsFilterInput, $limit: Int, $nextToken: String) {
    listFinancialReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        companyId
        reportDate
        companyName
        industry
        creditScore
        creditDecision
        reportStatus
        lastUpdated
        financialRatios
        recommendations
        performanceTrends
      }
      nextToken
    }
  }
`;

// Query to filter reports by industry
const LIST_REPORTS_BY_INDUSTRY = gql`
  query ListReportsByIndustry($industry: String!, $limit: Int, $nextToken: String) {
    listFinancialReports(
      filter: { industry: { eq: $industry } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        companyId
        reportDate
        companyName
        industry
        creditScore
        creditDecision
        reportStatus
        lastUpdated
        financialRatios
        recommendations
        performanceTrends
      }
      nextToken
    }
  }
`;

// Query to filter reports by credit decision
const LIST_REPORTS_BY_CREDIT_DECISION = gql`
  query ListReportsByCreditDecision($creditDecision: String!, $limit: Int, $nextToken: String) {
    listFinancialReports(
      filter: { creditDecision: { eq: $creditDecision } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        companyId
        reportDate
        companyName
        industry
        creditScore
        creditDecision
        reportStatus
        lastUpdated
        financialRatios
        recommendations
        performanceTrends
      }
      nextToken
    }
  }
`;

// Updated GraphQL mutation definitions
const CREATE_FINANCIAL_REPORT = gql`
  mutation CreateFinancialReport($input: CreateFinancialReportsInput!) {
    createFinancialReports(input: $input) {
      companyId
      reportDate
      companyName
      industry
      creditScore
      creditDecision
      reportStatus
      lastUpdated
      financialRatios
      recommendations
      performanceTrends
    }
  }
`;

const UPDATE_FINANCIAL_REPORT = gql`
  mutation UpdateFinancialReport($input: UpdateFinancialReportsInput!) {
    updateFinancialReports(input: $input) {
      companyId
      reportDate
      companyName
      industry
      creditScore
      creditDecision
      reportStatus
      lastUpdated
      financialRatios
      recommendations
      performanceTrends
    }
  }
`;

// For development: fallback mock data implementation
const mockGraphQLCall = async (operation: string, variables?: any): Promise<any> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data that matches your new schema
  const reports: FinancialReports[] = [
    {
      companyId: "MULTI-2024",
      reportDate: "2024-04-15",
      companyName: "MultiChoice Group",
      industry: "Media & Entertainment",
      creditScore: 82,
      creditDecision: "APPROVED",
      reportStatus: "PUBLISHED",
      lastUpdated: "2024-04-15T14:30:00Z",
      financialRatios: JSON.stringify({
        liquidityRatios: {
          currentRatio: { value: 1.85, explanation: "The company has strong short-term liquidity with current assets exceeding current liabilities.", assessment: "positive" },
          quickRatio: { value: 1.42, explanation: "The company can meet short-term obligations without relying on inventory.", assessment: "positive" }
        },
        profitabilityRatios: {
          grossProfitMargin: { value: 35.2, explanation: "Strong profit margin indicates efficient operational management.", assessment: "positive" },
          operatingProfitMargin: { value: 18.4, explanation: "Above industry average operating efficiency.", assessment: "positive" },
          returnOnAssets: { value: 12.7, explanation: "Good return on assets indicates effective use of company assets to generate profits.", assessment: "positive" }
        },
        solvencyRatios: {
          debtToEquityRatio: { value: 0.68, explanation: "The company has a conservative debt structure with more equity than debt.", assessment: "positive" },
          interestCoverageRatio: { value: 8.5, explanation: "Company generates enough operating income to cover interest expenses multiple times.", assessment: "positive" }
        }
      }),
      recommendations: JSON.stringify([
        "Consider optimizing inventory management to improve the inventory turnover ratio.",
        "Maintain the current debt management strategy as it provides a good balance between leverage and financial stability.",
        "Explore opportunities to improve asset utilization to enhance the asset turnover ratio."
      ]),
      performanceTrends: JSON.stringify({
        revenue: [45, 47, 52, 58, 62],
        profit: [12, 14, 15, 18, 20],
        debt: [30, 28, 25, 22, 20]
      })
    }
  ];
  
  // Mock operations based on the updated GraphQL schema
  switch (operation) {
    case 'getFinancialReports':
      return reports.find(r => 
        r.companyId === variables.companyId && 
        r.reportDate === variables.reportDate
      ) || null;
      
    case 'listFinancialReports':
      let filteredReports = reports;
      
      if (variables.filter) {
        if (variables.filter.companyId?.eq) {
          filteredReports = filteredReports.filter(r => r.companyId === variables.filter.companyId.eq);
        }
        if (variables.filter.industry?.eq) {
          filteredReports = filteredReports.filter(r => r.industry === variables.filter.industry.eq);
        }
        if (variables.filter.creditDecision?.eq) {
          filteredReports = filteredReports.filter(r => r.creditDecision === variables.filter.creditDecision.eq);
        }
      }
      
      return {
        items: filteredReports.slice(0, variables.limit || 10),
        nextToken: filteredReports.length > (variables.limit || 10) ? "nextPageToken" : null
      };
        
    default:
      return { items: [], nextToken: null };
  }
};

// Adapted format for our application
const formatReportData = (appSyncData: any): Report | null => {
  if (!appSyncData) return null;
  
  console.log('Raw AppSync data:', appSyncData);
  
  // Check if data is in DynamoDB format
  const isDynamoDBFormat = appSyncData.companyId?.S !== undefined;
  
  // If it's in DynamoDB format, parse it first
  const data = isDynamoDBFormat ? parseDynamoDBItem(appSyncData) : appSyncData;
  
  // Parse JSON strings from DynamoDB or regular data
  let financialRatios = [];
  let insights = [];
  let recommendations = [];
  let trends = { revenue: [0, 0, 0, 0, 0], profit: [0, 0, 0, 0, 0], debt: [0, 0, 0, 0, 0] };
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  
  // Process financial ratios
  if (data.financialRatios) {
    try {
      const ratiosObj = typeof data.financialRatios === 'string' 
        ? JSON.parse(data.financialRatios) 
        : data.financialRatios;
        
      Object.entries(ratiosObj).forEach(([category, metrics]: [string, any]) => {
        Object.entries(metrics).forEach(([metric, metricData]: [string, any]) => {
          financialRatios.push({
            category,
            metric,
            value: typeof metricData === 'object' ? metricData.value : metricData,
            explanation: typeof metricData === 'object' ? metricData.explanation : `${metric} for ${category}`,
            assessment: typeof metricData === 'object' ? (metricData.assessment || 'neutral') : 'neutral'
          });
        });
      });
    } catch (e) {
      console.error('Error parsing financialRatios:', e);
    }
  }
  
  // Process recommendations
  if (data.recommendations) {
    try {
      recommendations = typeof data.recommendations === 'string' 
        ? JSON.parse(data.recommendations) 
        : data.recommendations;
    } catch (e) {
      console.error('Error parsing recommendations:', e);
    }
  }
  
  // Process performance trends
  if (data.performanceTrends) {
    try {
      trends = typeof data.performanceTrends === 'string' 
        ? JSON.parse(data.performanceTrends) 
        : data.performanceTrends;
    } catch (e) {
      console.error('Error parsing performanceTrends:', e);
    }
  }
  
  // Calculate risk level based on credit score
  const creditScore = data.creditScore || 0;
    
  if (creditScore >= 75) riskLevel = 'low';
  else if (creditScore >= 60) riskLevel = 'medium';
  else riskLevel = 'high';
  
  // Create standardized report format
  return {
    reportId: `${data.companyId}-${data.reportDate}`,
    companyName: data.companyName || 'Unknown Company',
    industry: data.industry || 'Unknown Industry',
    date: data.reportDate,
    year: new Date(data.reportDate).getFullYear().toString(),
    creditScore: creditScore,
    ratios: financialRatios,
    insights: insights,
    recommendations: recommendations,
    riskLevel: riskLevel,
    trends: trends,
    companyProfile: data.companyProfile || ''
  };
};

/**
 * Hook for interacting with AppSync GraphQL data
 */
export const useAppSyncData = () => {
  // Get the Apollo client
  const client = getApolloClient();
  
  /**
   * Fetches a financial report by company ID and report date
   */
  const getFinancialReport = async (companyId: string, reportDate: string) => {
    try {
      console.log('Fetching financial report:', { companyId, reportDate });
      
      if (API_CONFIG.APPSYNC.apiKey) {
        const { data } = await client.query({
          query: GET_FINANCIAL_REPORTS,
          variables: { companyId, reportDate },
          fetchPolicy: 'network-only'
        });
        
        console.log('GraphQL response for getFinancialReport:', data);
        return formatReportData(data.getFinancialReports);
      } else {
        console.warn('No API key found, using mock data');
        const mockData = await mockGraphQLCall('getFinancialReports', { companyId, reportDate });
        return formatReportData(mockData);
      }
    } catch (error) {
      console.error('Error fetching financial report:', error);
      throw error;
    }
  };
  
  /**
   * Fetches all financial reports
   */
  const fetchAllReports = async (filter = {}, limit = 20) => {
    try {
      console.log('Fetching all reports with filter:', filter);
      
      if (API_CONFIG.APPSYNC.apiKey) {
        const { data } = await client.query({
          query: LIST_FINANCIAL_REPORTS,
          variables: { filter, limit },
          fetchPolicy: 'network-only'
        });
        
        console.log('GraphQL response for listFinancialReports:', data);
        
        // Check if data and items exist before proceeding
        if (!data || !data.listFinancialReports || !data.listFinancialReports.items) {
          console.warn('No items found in GraphQL response, returning empty array');
          return [];
        }
        
        return data.listFinancialReports.items.map(formatReportData).filter(Boolean);
      } else {
        console.warn('No API key found, using mock data');
        const mockData = await mockGraphQLCall('listFinancialReports', { filter, limit });
        
        // Ensure mock data has proper structure
        if (!mockData || !mockData.items) {
          console.warn('Mock data missing items array, returning empty array');
          return [];
        }
        
        return mockData.items.map(formatReportData).filter(Boolean);
      }
    } catch (error) {
      console.error('Error fetching all reports:', error);
      throw error;
    }
  };

  /**
   * Fetches financial reports filtered by industry
   */
  const listReportsByIndustry = async (industry: string, limit = 20) => {
    try {
      console.log('Fetching reports by industry:', industry);
      
      if (API_CONFIG.APPSYNC.apiKey) {
        const { data } = await client.query({
          query: LIST_REPORTS_BY_INDUSTRY,
          variables: { industry, limit },
          fetchPolicy: 'network-only'
        });
        
        console.log('GraphQL response for listReportsByIndustry:', data);
        
        if (!data || !data.listFinancialReports || !data.listFinancialReports.items) {
          console.warn('No items found in industry reports response, returning empty array');
          return [];
        }
        
        return data.listFinancialReports.items.map(formatReportData).filter(Boolean);
      } else {
        console.warn('No API key found, using mock data');
        const mockData = await mockGraphQLCall('listFinancialReports', { filter: { industry: { eq: industry } }, limit });
        
        if (!mockData || !mockData.items) {
          console.warn('Mock data missing items array, returning empty array');
          return [];
        }
        
        return mockData.items.map(formatReportData).filter(Boolean);
      }
    } catch (error) {
      console.error(`Error fetching reports for industry ${industry}:`, error);
      throw error;
    }
  };

  /**
   * Fetches financial reports filtered by credit decision
   */
  const listReportsByCreditDecision = async (creditDecision: CreditDecision, limit = 20) => {
    try {
      console.log('Fetching reports by credit decision:', creditDecision);
      
      if (API_CONFIG.APPSYNC.apiKey) {
        const { data } = await client.query({
          query: LIST_REPORTS_BY_CREDIT_DECISION,
          variables: { creditDecision, limit },
          fetchPolicy: 'network-only'
        });
        
        console.log('GraphQL response for listReportsByCreditDecision:', data);
        
        if (!data || !data.listFinancialReports || !data.listFinancialReports.items) {
          console.warn('No items found in credit decision reports response, returning empty array');
          return [];
        }
        
        return data.listFinancialReports.items.map(formatReportData).filter(Boolean);
      } else {
        console.warn('No API key found, using mock data');
        const mockData = await mockGraphQLCall('listFinancialReports', { filter: { creditDecision: { eq: creditDecision } }, limit });
        
        if (!mockData || !mockData.items) {
          console.warn('Mock data missing items array, returning empty array');
          return [];
        }
        
        return mockData.items.map(formatReportData).filter(Boolean);
      }
    } catch (error) {
      console.error(`Error fetching reports for credit decision ${creditDecision}:`, error);
      throw error;
    }
  };
  
  /**
   * Creates a new financial report
   */
  const createFinancialReport = async (reportData: any) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_FINANCIAL_REPORT,
        variables: { input: reportData }
      });
      
      return formatReportData(data.createFinancialReports);
    } catch (error) {
      console.error("Error creating financial report:", error);
      throw error;
    }
  };
  
  /**
   * Updates an existing financial report
   */
  const updateFinancialReport = async (reportData: any) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_FINANCIAL_REPORT,
        variables: { input: reportData }
      });
      
      return formatReportData(data.updateFinancialReports);
    } catch (error) {
      console.error("Error updating financial report:", error);
      throw error;
    }
  };
  
  return {
    getFinancialReport,
    fetchAllReports,
    listReportsByIndustry,
    listReportsByCreditDecision,
    createFinancialReport,
    updateFinancialReport
  };
};
