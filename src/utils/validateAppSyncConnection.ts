
import { ApolloClient, InMemoryCache, HttpLink, gql, ApolloLink } from '@apollo/client';
import { createAuthLink } from 'aws-appsync-auth-link';
import { Sha256 } from '@aws-crypto/sha256-js';
import { API_CONFIG } from '@/config/api.config';

// Define the global object for aws-appsync-auth-link compatibility
if (typeof window !== 'undefined' && !window.global) {
  (window as any).global = window;
}

const TEST_QUERY = gql`
  query TestConnection {
    listFinancialReports(limit: 1) {
      items {
        companyId
        reportDate
        companyName
        industry
        creditScore
        creditDecision
      }
    }
  }
`;

export const validateAppSyncConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get AppSync configuration from config
    const apiKey = API_CONFIG.APPSYNC.apiKey;
    const httpEndpoint = API_CONFIG.APPSYNC.endpoint;
    
    console.log('Validating AppSync connection with:');
    console.log('- Endpoint:', httpEndpoint);
    console.log('- API Key provided:', apiKey ? 'Yes' : 'No');
    console.log('- Region:', API_CONFIG.APPSYNC.region);
    
    if (!apiKey) {
      return {
        success: false,
        message: "Missing API key. Please check configuration."
      };
    }
    
    if (!httpEndpoint) {
      return {
        success: false,
        message: "Missing GraphQL endpoint. Please check configuration."
      };
    }
    
    // Create auth link with proper typing for disableOffline
    const authLink = createAuthLink({
      url: httpEndpoint,
      region: API_CONFIG.APPSYNC.region,
      auth: {
        type: 'API_KEY',
        apiKey
      },
      ...(({ disableOffline: true, SHA256: Sha256 } as any))
    });
    
    // Create HTTP link
    const httpLink = new HttpLink({
      uri: httpEndpoint
    });
    
    // Create Apollo Client for testing
    const client = new ApolloClient({
      link: ApolloLink.from([authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        }
      }
    });
    
    // Attempt a simple query to test the connection
    console.log('Testing GraphQL query...');
    const result = await client.query({
      query: TEST_QUERY,
      errorPolicy: 'all'
    });
    
    console.log('GraphQL query result:', result);
    
    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL errors:', result.errors);
      return {
        success: false,
        message: `GraphQL error: ${result.errors[0].message}`
      };
    }
    
    // Successful connection and query
    return {
      success: true,
      message: "AppSync connection validated successfully"
    };
  } catch (error: any) {
    console.error("Error validating AppSync connection:", error);
    
    // More detailed error handling
    if (error.networkError) {
      console.error("Network error details:", error.networkError);
      if (error.networkError.statusCode === 401) {
        return {
          success: false,
          message: `Authentication failed (401): Check your API key and permissions. API Key: ${API_CONFIG.APPSYNC.apiKey ? 'Present' : 'Missing'}`
        };
      } else if (error.networkError.statusCode === 403) {
        return {
          success: false,
          message: `Access forbidden (403): Check your API key permissions and endpoint URL.`
        };
      }
      return {
        success: false,
        message: `Network error (${error.networkError.statusCode || 'Unknown'}): ${error.networkError.message || 'Check your network connection and endpoint URL'}`
      };
    } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return {
        success: false,
        message: `GraphQL error: ${error.graphQLErrors[0].message}`
      };
    }
    
    return {
      success: false,
      message: `Failed to connect to AppSync: ${error.message || 'Unknown error'}`
    };
  }
};
