
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createHttpLink } from '@apollo/client/link/http';
import { Sha256 } from '@aws-crypto/sha256-js';

/**
 * Validates connection to AWS AppSync GraphQL API
 * @returns Promise with connection status and message
 */
export const validateAppSyncConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get API key and endpoint from environment variables
    const apiKey = import.meta.env.VITE_APPSYNC_API_KEY;
    const endpoint = import.meta.env.VITE_APPSYNC_ENDPOINT || 
      'https://mbk6kqyz5jdednao4spo6lntn4.appsync-api.us-east-1.amazonaws.com/graphql';

    if (!apiKey) {
      return { 
        success: false, 
        message: 'API Key is missing. Please set the VITE_APPSYNC_API_KEY environment variable.' 
      };
    }

    // Create auth link with API key
    const authLink = createAuthLink({
      url: endpoint,
      region: 'us-east-1', // Assuming region is us-east-1, update as needed
      auth: {
        type: 'API_KEY',
        apiKey
      },
      disableOffline: true,
      SHA256: Sha256 // Fixed SHA256 reference
    });

    // Create HTTP link
    const httpLink = createHttpLink({ uri: endpoint });

    // Create temporary Apollo client for validation
    const validationClient = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    // Simple test query to check connection
    const response = await validationClient.query({
      query: gql`
        query TestConnection {
          __schema {
            types {
              name
            }
          }
        }
      `
    });

    return { 
      success: true, 
      message: 'Successfully connected to AWS AppSync GraphQL API'
    };
  } catch (error) {
    console.error('AppSync connection validation failed:', error);
    return { 
      success: false, 
      message: `Failed to connect to AppSync API: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
