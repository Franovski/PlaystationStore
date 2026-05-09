import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { store } from '../store';
import { tokenService } from './tokenService';

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

const httpLink = createHttpLink({
  uri: `${apiBaseUrl}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // Try to get token from Redux store, fallback to localStorage
  let token = store.getState().auth?.accessToken;
  if (!token) {
    token = tokenService.getToken();
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
