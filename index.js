import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './schema'
import mongoose from 'mongoose'

const PORT = 4000

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
})

const app = express()

server.applyMiddleware({ app }) // app is from an existing express app

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
 