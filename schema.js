import { gql, makeExecutableSchema } from "apollo-server-express";

// The GraphQL schema
const typeDefs = gql`
  type Book {
    title: String
    author: Author
  }

  type Author {
    books: [Book]
  }

  type Query {
    author: Author
  }
`

// A map of functions which return data for the schema.
const resolvers = {
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
