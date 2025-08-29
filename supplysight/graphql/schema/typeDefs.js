// const { gql } = require('apollo-server');

// const typeDefs = gql`
//   type User {
//     id: ID!
//     name: String!
//     email: String!
//     role: String!
//   }

//   type Query {
//     users: [User]
//   }

//   type Mutation {
//     addUser(name: String!, email: String!, role: String!): User
//     deleteUser(id: ID!): User
//     updateUser(id: ID!, name: String!, email: String!): User
//   }
// `;

// module.exports = typeDefs;

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



