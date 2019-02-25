import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import mongoose from 'mongoose'
import cachegoose from 'cachegoose'

function connectMongo(mongoUri) {
  mongoose.connect(mongoUri, { useNewUrlParser: true })
  cachegoose(mongoose)
}

// CourseApiServer returns an ApolloServer connected to the MongoDB database
export function CourseApiServer(mongoUri, options = {}) {
  const { debug, introspection, playground, tracing, engine } = options
  if (debug) {
    mongoose.set('debug', true)
  }
  connectMongo(mongoUri)
  return new ApolloServer({
    typeDefs,
    resolvers,
    cacheControl: {
      defaultMaxAge: 240
    },
    introspection,
    tracing,
    playground,
    engine
  })
}
