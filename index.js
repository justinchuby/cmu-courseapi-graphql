/* eslint-disable no-console */
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { schema } from './schema'
import mongoose from 'mongoose'

const PORT = 4000

mongoose.connect('mongodb+srv://test-a:nebku0-hYpqeq-qagmuh@cluster0-ydk8h.mongodb.net/test?retryWrites=true')

const server = new ApolloServer(schema)
const app = express()

server.applyMiddleware({ app }) // app is from an existing express app

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
