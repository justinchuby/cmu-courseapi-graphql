/* eslint-disable no-console */
import express from 'express'
import { CourseApiServer } from './index'

const PORT = 4000
const DB_NAME = 'courseapi'
const MONGO_URI = `mongodb+srv://test-a:nebku0-hYpqeq-qagmuh@cluster0-ydk8h.mongodb.net/${DB_NAME}?retryWrites=true`

const server = new CourseApiServer(MONGO_URI)
const app = express()

server.applyMiddleware({ app }) // app is from an existing express app

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
)
