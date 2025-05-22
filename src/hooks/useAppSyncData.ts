import { useQuery, useMutation } from '@tanstack/react-query';
import { ApolloClient, InMemoryCache, HttpLink, split, gql, ApolloLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createAuthLink } from 'aws-appsync-auth-link';
import { Sha256 } from '@aws-crypto/sha256-js';
import { Report } from './useReportsService';

// Define types from the GraphQL schema
export enum CreditDecision {
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  PENDING = "PENDING"
}

export enum ReportStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED"
}

// Define the missing FinancialReports interface
interface FinancialReports {
  companyId: string;
  reportDate: string;
  companyName: string;
  industry: string;
  creditScore: number;
  creditDecision: CreditDecision;
  reportStatus: ReportStatus;
  lastUpdated: string;
  financialRatios: string;
  recommendations: string;
  performanceTrends: string;
}

// Create Apollo Client instance with API key authentication and proper error handling
const createApolloClient = () => {
  // Get API key and endpoints from environment variables
  const apiKey = import.meta.env.VITE_APPSYNC_API_KEY || '';
  
  // Log configuration info (for debugging) - safely
  console.log('AppSync Configuration:');
  console.log('- API Key provided:', apiKey ? 'Yes' : 'No');
  
  // Define endpoints from environment variables or use defaults
  const httpEndpoint = import.meta.env.VITE_APPSYNC_ENDPOINT || 
    'https://mbk6kqyz5jdednao4spo6lntn4.appsync-api.us-east-1.amazonaws.com/graphql';
  const wsEndpoint = import.meta.env.VITE_APPSYNC_REALTIME_ENDPOINT || 
    'wss://mbk6kqyz5jdednao4spo6lntn4.appsync-realtime-api.us-east-1.amazonaws.com/graphql';
  
  // Create auth link using aws-appsync-auth-link
  // TypeScript doesn't recognize disableOffline in the type definitions
  // but the library actually accepts it - we'll cast to any to avoid the error
  const authLink = createAuthLink({
    url: httpEndpoint,
    region: 'us-east-1',
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
        // You can handle specific error types here
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
              // Merge function for proper pagination
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
let apolloClient = null;

// Initialize client on demand to ensure environment variables are loaded
const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
};

// GraphQL query definitions
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

const GET_LATEST_REPORT = gql`
  query GetLatestReport($companyId: String!) {
    getLatestReport(companyId: $companyId) {
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

const LIST_REPORTS_BY_INDUSTRY = gql`
  query ListReportsByIndustry($industry: String!, $filter: TableFinancialReportsFilterInput, $limit: Int, $nextToken: String) {
    listReportsByIndustry(industry: $industry, filter: $filter, limit: $limit, nextToken: $nextToken) {
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

const LIST_REPORTS_BY_CREDIT_DECISION = gql`
  query ListReportsByCreditDecision($creditDecision: CreditDecision!, $filter: TableFinancialReportsFilterInput, $limit: Int, $nextToken: String) {
    listReportsByCreditDecision(creditDecision: $creditDecision, filter: $filter, limit: $limit, nextToken: $nextToken) {
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

// GraphQL mutation definitions for creating/updating data
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
// This will be used only when API key is not available
const mockGraphQLCall = async (operation: string, variables?: any): Promise<any> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data that matches our DynamoDB schema
  const reports: FinancialReports[] = [
    {
      companyId: "MULTI-2024",
      reportDate: "2024-04-15",
      companyName: "MultiChoice Group",
      industry: "Media & Entertainment",
      creditScore: 82,
      creditDecision: CreditDecision.APPROVED,
      reportStatus: ReportStatus.PUBLISHED,
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
        },
        efficiencyRatios: {
          assetTurnoverRatio: { value: 0.74, explanation: "The company could improve efficiency in using assets to generate revenue.", assessment: "neutral" },
          inventoryTurnover: { value: 5.2, explanation: "Moderate inventory turnover indicates potential for optimization.", assessment: "neutral" }
        },
        marketValueRatios: {
          priceToEarnings: { value: 14.8, explanation: "P/E ratio is reasonable compared to industry peers, suggesting fair valuation.", assessment: "neutral" }
        }
      }),
      recommendations: JSON.stringify([
        "Consider optimizing inventory management to improve the inventory turnover ratio.",
        "Maintain the current debt management strategy as it provides a good balance between leverage and financial stability.",
        "Explore opportunities to improve asset utilization to enhance the asset turnover ratio.",
        "Continue investing in high-return content production to maintain competitive advantage.",
        "Consider strategic acquisitions in emerging markets to diversify revenue streams."
      ]),
      performanceTrends: JSON.stringify({
        revenue: [45, 47, 52, 58, 62],
        profit: [12, 14, 15, 18, 20],
        debt: [30, 28, 25, 22, 20]
      })
    }
  ];
  
  // Mock operations based on the GraphQL schema
  switch (operation) {
    case 'getFinancialReports':
      return reports.find(r => 
        r.companyId === variables.companyId && 
        r.reportDate === variables.reportDate
      ) || null;
      
    case 'listFinancialReports':
      let filteredReports = reports;
      
      if (variables.filter) {
        // Apply filters (simplified implementation)
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
        
    case 'getLatestReport':
      return reports.filter(r => r.companyId === variables.companyId)
        .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())[0] || null;
        
    case 'listReportsByIndustry':
      const industryReports = reports.filter(r => r.industry === variables.industry);
      return {
        items: industryReports.slice(0, variables.limit || 10),
        nextToken: industryReports.length > (variables.limit || 10) ? "nextPageToken" : null
      };
      
    case 'listReportsByCreditDecision':
      const decisionReports = reports.filter(r => r.creditDecision === variables.creditDecision);
      return {
        items: decisionReports.slice(0, variables.limit || 10),
        nextToken: decisionReports.length > (variables.limit || 10) ? "nextPageToken" : null
      };
        
    default:
      return null;
  }
};

// Adapted format for our application
const formatReportData = (appSyncData: any): Report | null => {
  if (!appSyncData) return null;
  
  // Parse JSON strings from DynamoDB
  let financialRatios = [];
  let insights = [];
  let recommendations = [];
  let trends = { revenue: [0, 0, 0, 0, 0], profit: [0, 0, 0, 0, 0], debt: [0, 0, 0, 0, 0] };
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  
  if (appSyncData.financialRatios) {
    try {
      const ratiosObj = JSON.parse(appSyncData.financialRatios);
      // Flatten the nested financial ratios structure
      Object.entries(ratiosObj).forEach(([category, metrics]: [string, any]) => {
        Object.entries(metrics).forEach(([metric, data]: [string, any]) => {
          financialRatios.push({
            category,
            metric,
            value: data.value,
            explanation: data.explanation,
            assessment: data.assessment || 'neutral'
          });
        });
      });
    } catch (e) {
      console.error('Error parsing financialRatios JSON:', e);
    }
  }
  
  if (appSyncData.recommendations) {
    try {
      recommendations = JSON.parse(appSyncData.recommendations);
    } catch (e) {
      console.error('Error parsing recommendations JSON:', e);
    }
  }
  
  if (appSyncData.performanceTrends) {
    try {
      trends = JSON.parse(appSyncData.performanceTrends);
    } catch (e) {
      console.error('Error parsing performanceTrends JSON:', e);
    }
  }
  
  // Calculate risk level based on credit score
  if (appSyncData.creditScore) {
    if (appSyncData.creditScore >= 75) riskLevel = 'low';
    else if (appSyncData.creditScore >= 60) riskLevel = 'medium';
    else riskLevel = 'high';
  }
  
  return {
    reportId: `${appSyncData.companyId}-${appSyncData.reportDate}`,
    companyName: appSyncData.companyName,
    industry: appSyncData.industry,
    date: appSyncData.reportDate,
    year: new Date(appSyncData.reportDate).getFullYear().toString(),
    creditScore: appSyncData.creditScore || 0,
    ratios: financialRatios,
    insights: insights,
    recommendations: recommendations,
    riskLevel: riskLevel,
    trends: trends,
    companyProfile: appSyncData.companyProfile || ''
  };
};

/**
 * Hook for interacting with AppSync GraphQL data
 * Provides methods for querying financial reports data
 */
export const useAppSyncData = () => {
  // Get the Apollo client
  const client = getApolloClient();
  
  /**
   * Fetches a financial report by company ID and report date
   * @param companyId Company identifier
   * @param reportDate Date of the report
   * @returns Normalized report data
   */
  const getFinancialReport = async (companyId: string, reportDate: string) => {
    try {
      // Try to use the real GraphQL API if we have an API key
      if (import.meta.env.VITE_APPSYNC_API_KEY) {
        const { data } = await client.query({
          query: GET_FINANCIAL_REPORTS,
          variables: { companyId, reportDate },
          fetchPolicy: 'network-only' // Ensures fresh data
        });
        
        return formatReportData(data.getFinancialReports);
      } else {
        // Fallback to mock data if no API key
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
   * @param filter Optional filter criteria
   * @param limit Maximum number of items to return
   * @returns Array of normalized report data
   */
  const fetchAllReports = async (filter = {}, limit = 20) => {
    try {
      if (import.meta.env.VITE_APPSYNC_API_KEY) {
        const { data } = await client.query({
          query: LIST_FINANCIAL_REPORTS,
          variables: { filter, limit },
          fetchPolicy: 'network-only'
        });
        
        return data.listFinancialReports.items.map(formatReportData);
      } else {
        console.warn('No API key found, using mock data');
        const mockData = await mockGraphQLCall('listFinancialReports', { filter, limit });
        return mockData.items.map(formatReportData);
      }
    } catch (error) {
      console.error('Error fetching all reports:', error);
      throw error;
    }
  };
  
  /**
   * Fetches the latest report for a specific company
   * @param companyId The company ID
   * @returns The latest formatted report data
   */
  const getLatestReport = async (companyId: string) => {
    try {
      const { data } = await client.query({
        query: GET_LATEST_REPORT,
        variables: { companyId },
        fetchPolicy: 'network-only'
      });
      
      return formatReportData(data.getLatestReport);
    } catch (error) {
      console.error("Error fetching latest report from AppSync:", error);
      
      // Fallback to mock data during development
      if (import.meta.env.DEV) {
        console.log("Falling back to mock data in development mode");
        const mockResponse = await mockGraphQLCall('getLatestReport', { companyId });
        return formatReportData(mockResponse);
      }
      
      throw error;
    }
  };
  
  /**
   * Lists reports filtered by industry
   * @param industry The industry to filter by
   * @param limit Optional maximum number of results
   * @returns Array of formatted report data
   */
  const listReportsByIndustry = async (industry: string, limit?: number) => {
    try {
      const { data } = await client.query({
        query: LIST_REPORTS_BY_INDUSTRY,
        variables: { industry, limit },
        fetchPolicy: 'network-only'
      });
      
      const items = data.listReportsByIndustry.items || [];
      return items.map((item: any) => formatReportData(item)).filter(Boolean);
    } catch (error) {
      console.error("Error fetching industry reports from AppSync:", error);
      
      // Fallback to mock data during development
      if (import.meta.env.DEV) {
        console.log("Falling back to mock data in development mode");
        const mockResponse = await mockGraphQLCall('listReportsByIndustry', { industry, limit });
        
        if (mockResponse && mockResponse.items) {
          return mockResponse.items.map((item: any) => formatReportData(item)).filter(Boolean);
        }
      }
      
      throw error;
    }
  };
  
  /**
   * Lists reports filtered by credit decision
   * @param creditDecision The credit decision to filter by
   * @param limit Optional maximum number of results
   * @returns Array of formatted report data
   */
  const listReportsByCreditDecision = async (creditDecision: CreditDecision, limit?: number) => {
    try {
      const { data } = await client.query({
        query: LIST_REPORTS_BY_CREDIT_DECISION,
        variables: { creditDecision, limit },
        fetchPolicy: 'network-only'
      });
      
      const items = data.listReportsByCreditDecision.items || [];
      return items.map((item: any) => formatReportData(item)).filter(Boolean);
    } catch (error) {
      console.error("Error fetching credit decision reports from AppSync:", error);
      
      // Fallback to mock data during development
      if (import.meta.env.DEV) {
        console.log("Falling back to mock data in development mode");
        const mockResponse = await mockGraphQLCall('listReportsByCreditDecision', { creditDecision, limit });
        
        if (mockResponse && mockResponse.items) {
          return mockResponse.items.map((item: any) => formatReportData(item)).filter(Boolean);
        }
      }
      
      throw error;
    }
  };
  
  /**
   * Creates a new financial report
   * @param reportData The report data to create
   * @returns Created report data
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
   * @param reportData The report data to update
   * @returns Updated report data
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
    getLatestReport,
    listReportsByIndustry,
    listReportsByCreditDecision,
    createFinancialReport,
    updateFinancialReport
  };
};

/**
 * Hook using Apollo Client directly for GraphQL operations
 * Useful for advanced use cases or direct access to Apollo Client
 */
export const useGraphQLReports = () => {
  // Ensure Apollo Client is initialized
  const client = getApolloClient();
  
  const fetchReports = async () => {
    try {
      const result = await client.query({
        query: LIST_FINANCIAL_REPORTS,
        variables: { limit: 10 }
      });
      return result.data?.listFinancialReports?.items || [];
    } catch (error) {
      console.error("Error fetching reports with Apollo:", error);
      
      // Fallback to mock during development
      if (import.meta.env.DEV) {
        console.log("Falling back to mock data in development mode");
        return mockGraphQLCall('listFinancialReports', { limit: 10 });
      }
      
      throw error;
    }
  };
  
  const getReportById = async (id: string) => {
    try {
      const [companyId, reportDate] = id.split('-');
      if (!companyId || !reportDate) {
        throw new Error("Invalid report ID format. Expected 'companyId-reportDate'");
      }
      
      const result = await client.query({
        query: GET_FINANCIAL_REPORTS,
        variables: { companyId, reportDate }
      });
      return result.data?.getFinancialReports;
    } catch (error) {
      console.error("Error fetching report by ID with Apollo:", error);
      
      // Fallback to mock during development
      if (import.meta.env.DEV) {
        console.log("Falling back to mock data in development mode");
        const [companyId, reportDate] = id.split('-');
        return mockGraphQLCall('getFinancialReports', { companyId, reportDate });
      }
      
      throw error;
    }
  };
  
  return {
    fetchReports,
    getReportById,
    client // Expose the Apollo Client instance for advanced use cases
  };
};
