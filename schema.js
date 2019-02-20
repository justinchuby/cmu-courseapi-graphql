import { gql, makeExecutableSchema } from 'apollo-server-express'

// Resolver dependency
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

// The GraphQL schema
const typeDefs = gql`
  scalar Date

  type MyType {
    created: Date
  }

  type Course {
    courseId: String!
    desc: String
    name: String
    notes: String
    department: String
    meetings: [Meeting]
    coreqs: String
    coreqsObj: Requisite
    prereqs: String
    prereqsObj: Requisite
    semester: String
    year: Int
    units: Int
    rundate: Date
  }

  type Meeting {
    courseId: String!
    name: String
    times: [EventTime]
    instructors: [String]
    type: String
    semester: String
    year: Int
    rundate: Date
  }

  type EventTime {
    days: [Int]
    begin: Int
    end: Int
    building: String
    room: String
    location: String
  }

  type Requisite {
    reqs: [[String]]
    invert: Boolean
  }

  type Query {
    course(courseId: String): Course

  }
`

// TODO: See https://graphql.org/learn/schema/#union-types
// TODO: See https://www.apollographql.com/docs/graphql-tools/scalars.html#Date-as-a-scalar

// A map of functions which return data for the schema.
const resolvers = {
  Date: new GraphQLScalarType({
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
    },
  }),
  Query: {
    author(parent, args, context, info) {
      return find(authors, { id: args.id });
    }
  },
  Author: {
    books(author) {
      return filter(books, { author: author.name });
    }
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
