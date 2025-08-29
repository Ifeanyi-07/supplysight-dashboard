const { gql } = require('apollo-server');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    stock: Int!
    demand: Int!
    warehouse: String!
    status: String! # Healthy | Low | Critical
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product
    transferStock(id: ID!, stock: Int!): Product
  }
`;

module.exports = typeDefs;



