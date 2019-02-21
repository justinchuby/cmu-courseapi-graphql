import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { Course, Meeting } from './models'

// promisify found on https://g00glen00b.be/graphql-nodejs-express-apollo/
const promisify = query => new Promise((resolve, reject) => {
  query.exec((err, data) => {
    if (err) reject(err)
    else resolve(data)
  })
})

const dateScalarType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value) // value from the client
  },
  serialize(value) {
    return value.getTime() // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value) // ast value is always in string format
    }
    return null
  }
})

// TODO: See https://graphql.org/learn/schema/#union-types
// TODO: See https://www.apollographql.com/docs/graphql-tools/scalars.html#Date-as-a-scalar

// A map of functions which return data for the schema.
export const resolvers = {
  Date: dateScalarType,
  Query: {
    // courses: (args) => promisify(Course.find({}).skip(args.query.offset).limit(args.query.limit))
    courses: () => promisify(Course.find({}))
  },
}
