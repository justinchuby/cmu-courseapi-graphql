import express from 'express'
import cors from 'cors'
import { CourseApiServer } from './index'

// DEBUG
const debug = process.env.NODE_ENV !== 'production'
if (debug) {
  require('dotenv').config()
}

const mongoUri = `${process.env.MONGO_URI}/${process.env.DB_NAME}?retryWrites=true`
const port = process.env.PORT
const engineApiKey = process.env.ENGINE_API_KEY

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

app.use(cors())
server.applyMiddleware({ app }) // app is from an existing express app

app.listen({ port }, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
})
