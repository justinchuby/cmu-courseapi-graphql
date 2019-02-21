/* eslint-disable no-console */
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import mongoose from 'mongoose'

const PORT = 4000
const DB_NAME = 'courseapi'
const MONGO_URI = `mongodb+srv://test-a:nebku0-hYpqeq-qagmuh@cluster0-ydk8h.mongodb.net/${DB_NAME}?retryWrites=true`

function connectMongo() {
  // DEBUG
  mongoose.set('debug', true)
  mongoose.connect(
    MONGO_URI,
    { useNewUrlParser: true }
  )
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => ({
    mongo: await connectMongo()
  })
})

const app = express()

server.applyMiddleware({ app }) // app is from an existing express app

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
)
