import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import mongoose from 'mongoose'
import cachegoose from 'cachegoose'

// DEBUG
mongoose.set('debug', true)

function connectMongo(mongoURI) {
  mongoose.connect(mongoURI, { useNewUrlParser: true })
  cachegoose(mongoose)
}

// CourseApiServer returns an ApolloServer connected to the MongoDB database
export function CourseApiServer(mongoURI) {
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
