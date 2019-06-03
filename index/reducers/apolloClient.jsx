// Apollo Client Setup
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


const cache = new InMemoryCache();

const X3API_BASE_URL = 'http://localhost:3000/api/cors_headers_hack';

const httpLink = new HttpLink({
  uri: X3API_BASE_URL,
});

const client = new ApolloClient({
  link: httpLink,
  cache,
});

export default client;
