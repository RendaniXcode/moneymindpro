
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Initialize Apollo Client
export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://your-appsync-endpoint.amazonaws.com/graphql',
    headers: {
      'x-api-key': 'YOUR_API_KEY', // Replace with your actual API key
    },
  }),
  cache: new InMemoryCache(),
});
