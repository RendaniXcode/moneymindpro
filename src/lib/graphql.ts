
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Initialize Apollo Client with more robust configuration
export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://your-appsync-endpoint.amazonaws.com/graphql',
    headers: {
      'x-api-key': 'YOUR_API_KEY', // Replace with your actual API key in production
    },
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getFinancialReport: {
            merge: true,
          },
          getTrendData: {
            merge: true,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

// Helper function to validate API connectivity
export const validateApiConnection = async () => {
  try {
    const result = await apolloClient.query({
      query: require('@/graphql/queries').GET_API_STATUS,
    });
    return { success: true, data: result.data };
  } catch (error) {
    console.error('API Connection Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
