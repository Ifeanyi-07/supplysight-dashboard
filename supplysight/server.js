// const express = require('express');
// // const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());


// const { ApolloServer } = require('apollo-server');
// const mongoose = require('mongoose');
// const typeDefs = require('./graphql/schema/typeDefs');
// const resolvers = require('./graphql/resolvers');

// const server = new ApolloServer({ typeDefs, resolvers });

// // Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/supplysight', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('✅ Connected to MongoDB');
//   return server.listen({ port: 4000 });
// })
// .then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// })
// .catch(err => console.error(err));









// const { ApolloServer } = require('apollo-server');
// const typeDefs = require('./graphql/schema/typeDefs');
// const resolvers = require('./graphql/resolvers');

// const server = new ApolloServer({ typeDefs, resolvers });

// server.listen({ port: 4000 }).then(({ url }) => {
//   console.log(`🚀 Mock API ready at ${url}`);
// });



const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/schema/typeDefs');
const resolvers = require('./graphql/resolvers');

// Use Render's PORT environment variable (or 4000 locally)
const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  try {
    const { url } = await server.listen({ port: PORT });
    console.log(`🚀 Mock API ready at ${url}`);
  } catch (err) {
    console.error("❌ Failed to start Apollo Server:", err);
  }
}

startServer();




