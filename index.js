import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import mongoose from 'mongoose'
import cachegoose from 'cachegoose'

function connectMongo(mongoURI) {
  mongoose.connect(mongoURI, { useNewUrlParser: true })
  cachegoose(mongoose)
}

// CourseApiServer returns an ApolloServer connected to the MongoDB database
export function CourseApiServer(mongoURI, debug = false) {
  if (debug) {
    mongoose.set('debug', true)
  }
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => ({
      mongo: await connectMongo(mongoURI)
    }),
    cacheControl: {
      defaultMaxAge: 240
    },
    introspection: true,
    playground: true,
  })
}
