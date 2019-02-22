import { GraphQLScalarType } from 'graphql'
// import { Kind } from 'graphql/language'
import { Course, Meeting } from './models'
import {
  buildMongoConditionsFromFilters,
  FILTER_CONDITION_TYPE
} from '@entria/graphql-mongo-helpers'
import { stringToRegexQuery } from './mongoHelpers'

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

const courseFilterMapping = {
  text: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: val => {
      return { $text: { $search: val } }
    }
  },
  courseId: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: stringToRegexQuery
  },
  coreq: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: val => {
      const regex = new RegExp(val)
      return {
        'coreqsObj.reqs': { $elemMatch: { $elemMatch: { $in: [regex] } } }
      }
    }
  },
  prereq: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: val => {
      const regex = new RegExp(val)
      return {
        'prereqsObj.reqs': { $elemMatch: { $elemMatch: { $in: [regex] } } }
      }
    }
  }
}

const meetingFilterMapping = {
  instructor: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: val => {
      const names = val.split(' ')
      const regexes = names.map(e => new RegExp(e, 'i'))
      return {
        $and: [{ $text: { $search: val } }, { instructor: { $in: regexes } }]
      }
    }
  },
  courseId: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: stringToRegexQuery
  },
  day: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.days',
    format: val => {
      return { $in: [val] }
    }
  },
  begin: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.begin'
  },
  end: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.end'
  },
  building: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.building'
  },
  room: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.room'
  },
  location: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.location'
  }
}

// A map of functions which return data for the schema.
export const resolvers = {
  Date: dateScalarType,
  Course: {
    meetings: ({ courseId, semester, year }) => {
      return Meeting.find({ courseId, semester, year }).exec()
    },
    coreqCourses: ({ coreqsObj }) => {
      if (coreqsObj) {
        // TODO: map each course to a course object
      }
      return null
    }
  },
  Meeting: {
    course: ({ courseId, semester, year }) => {
      return Course.findOne({ courseId, semester, year }).exec()
    }
  },
  Query: {
    course: (root, args) => {
      const { courseId, semester, year } = args
      return Course.findOne({ courseId, semester, year }).exec()
    },
    courses: (root, args) => {
      const { filter, offset, limit } = args
      const filterResult = buildMongoConditionsFromFilters(
        null,
        filter,
        courseFilterMapping
      )
      const query = Course.find(filterResult.conditions).skip(offset).limit(limit)
      return query.exec()
    },
    meetings: (root, args) => {
      const { filter, offset, limit } = args
      const filterResult = buildMongoConditionsFromFilters(
        null,
        filter,
        meetingFilterMapping
      )
      const query = Meeting.find(filterResult.conditions).skip(offset).limit(limit)
      return query.exec()
    }
  }
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
