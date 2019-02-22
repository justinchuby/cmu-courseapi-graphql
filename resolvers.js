/* eslint-disable no-console */
import { GraphQLScalarType } from 'graphql'
// import { Kind } from 'graphql/language'
import { Course, Meeting } from './models'

// promisify found on https://g00glen00b.be/graphql-nodejs-express-apollo/
const promisify = query => new Promise((resolve, reject) => {
  query.exec((err, data) => {
    if (err) reject(err)
    else resolve(data)
  })
})

const dateScalarType = new GraphQLScalarType({
  // https://www.apollographql.com/docs/graphql-tools/scalars.html#Date-as-a-scalar
  name: 'Date',
  description: 'The Javascript native Date type.',
  parseValue(value) {
    return new Date(value) // value from the client
  },
  serialize(value) {
    return value.toJSON() // value sent to the client
  },
  parseLiteral(ast) {
    // TODO: Add varification
    return new Date(ast.value)
  }
})

// TODO: See https://graphql.org/learn/schema/#union-types

// A map of functions which return data for the schema.
export const resolvers = {
  Date: dateScalarType,
  Course: {
    meetings: ({ courseId, semester, year }) => {
      return promisify(Meeting.find({ courseId, semester, year }))
    }
  },
  Meeting: {
    course: ({ courseId, semester, year }) => {
      return promisify(Course.findOne({ courseId, semester, year }))
    }
  },
  Query: {
    // courses: (args) => promisify(Course.find({}).skip(args.query.offset).limit(args.query.limit))
    // courses: (root, args, context, info) => {
    //   // TODO: look for arguments and chain query here
    //   // TODO: check info to see what's needed
    //   // TODO: to get meetings of a course, use $lookup
    //   // TODO: OR, see if graph ql can pass result as parameters
    //   promisify(Course.find({}))
    // },
    course: (root, args, context, info) => {
      const { courseId, semester, year } = args
      return promisify(Course.findOne({ courseId, semester, year }))
    },
    courses: (root, args, context, info) => {
      const {
        filter,

      } = args
    }
  },
}

// https://blog.apollographql.com/batching-client-graphql-queries-a685f5bcd41b
// $and:[{
//   $text: {
//     $search: "Moss Carrie-Anne"
// }},{
// cast: {
//     $elemMatch: {$regex: /Moss/, $regex: /Carrie-Anne/}}
// }]}
// );

// {"prereqsObj.reqs": {$elemMatch:{$elemMatch:{$in: ["15-112"]}}}}