
// This file is kept for backward compatibility 
// We're now using the REST API directly in useFinancialData.ts

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Initialize Apollo Client with basic configuration
// This is only used as a fallback and is not actively used
export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://10o0oyafx1.execute-api.eu-west-1.amazonaws.com/prod/finalfuctionpoc',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  cache: new InMemoryCache(),
});

// Helper function to validate API connectivity
export const validateApiConnection = async () => {
  try {
    const response = await fetch('https://10o0oyafx1.execute-api.eu-west-1.amazonaws.com/prod/finalfuctionpoc');
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Connection Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
