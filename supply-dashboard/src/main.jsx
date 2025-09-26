import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    // uri: 'http://localhost:4000/graphql',  // ✅ backend GraphQL server
    uri: import.meta.env.VITE_API_URL || "https://api.render.com/deploy/srv-d3bfp363jp1c73b0i9lg?key=huiGS48EMn4",
  }),
  cache: new InMemoryCache(),
});



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
