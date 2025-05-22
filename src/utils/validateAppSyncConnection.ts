
import { ApolloClient, InMemoryCache, HttpLink, gql, ApolloLink } from '@apollo/client';
import { createAuthLink } from 'aws-appsync-auth-link';
import { Sha256 } from '@aws-crypto/sha256-js';

// Define the global object for aws-appsync-auth-link compatibility
if (typeof window !== 'undefined' && !window.global) {
  (window as any).global = window;
}

const TEST_QUERY = gql`
  query TestConnection {
    getLatestReport(companyId: "test") {
      companyId
    }
  }
`;

export const validateAppSyncConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get AppSync configuration from environment variables
    const apiKey = import.meta.env.VITE_APPSYNC_API_KEY || '';
    const httpEndpoint = import.meta.env.VITE_APPSYNC_ENDPOINT || 
      'https://mbk6kqyz5jdednao4spo6lntn4.appsync-api.us-east-1.amazonaws.com/graphql';
    
    if (!apiKey) {
      return {
        success: false,
        message: "Missing API key. Please set VITE_APPSYNC_API_KEY environment variable."
      };
    }
    
    // Create auth link with proper typing for disableOffline
    const authLink = createAuthLink({
      url: httpEndpoint,
      region: 'us-east-1',
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
    const result = await client.query({
      query: TEST_QUERY,
      errorPolicy: 'all'
    });
    
    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      // Connection succeeded but query had errors (expected since we're using a dummy ID)
      return {
        success: true,
        message: "AppSync connection validated (expected query error for test ID)"
      };
    }
    
    // Successful connection and query
    return {
      success: true,
      message: "AppSync connection validated successfully"
    };
  } catch (error: any) {
    console.error("Error validating AppSync connection:", error);
    
    // Determine the error type
    if (error.networkError) {
      return {
        success: false,
        message: `Network error connecting to AppSync: ${error.networkError.message || 'Check your network connection or endpoint URL'}`
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
