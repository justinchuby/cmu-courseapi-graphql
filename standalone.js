import express from 'express'
import { CourseApiServer } from './index'

const dbName = process.env.DB_NAME || 'courseapi'
const mongoUri = process.env.MONGO_URI || `mongodb+srv://test-a:nebku0-hYpqeq-qagmuh@cluster0-ydk8h.mongodb.net/${dbName}?retryWrites=true`
const port = process.env.PORT || 4000

const server = new CourseApiServer(mongoUri)
const app = express()

server.applyMiddleware({ app }) // app is from an existing express app

app.listen({ port }, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
})
