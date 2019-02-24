import express from 'express'
import dotenv from 'dotenv'
import { CourseApiServer } from './index'

dotenv.config()

const mongoUri = process.env.MONGO_URI
const port = process.env.PORT
const engineApiKey = process.env.ENGINE_API_KEY
// DEBUG
const debug = process.env.NODE_ENV !== 'production'

const server = new CourseApiServer(mongoUri, {
  debug,
  introspection: true,
  tracing: true,
  playground: true,
  engine: {
    apiKey: engineApiKey
  }
})

const app = express()

server.applyMiddleware({ app }) // app is from an existing express app

app.listen({ port }, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
})
