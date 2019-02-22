import { gql } from 'apollo-server-express'

// The GraphQL schema
export const typeDefs = gql`
  scalar Date

  input CourseFilterInput {
    text: String
    courseId: String
    department: String
    semester: String
    year: Int
    year_gt: Int
    year_gte: Int
    year_lt: Int
    year_lte: Int
    coreq: String
    prereq: String
  }

  input MeetingFilterInput {
    courseId: String
    name: String
    semester: String
    year: Int
    year_gt: Int
    year_gte: Int
    year_lt: Int
    year_lte: Int
    day: Int
    begin: Int
    begin_gt: Int
    begin_gte: Int
    begin_lt: Int
    begin_lte: Int
    end: Int
    end_gt: Int
    end_gte: Int
    end_lt: Int
    end_lte: Int
    building: String
    room: String
    location: String
    instructor: String
    type: String
  }

  type Course {
    courseId: String!
    desc: String
    name: String
    notes: String
    department: String
    meetings: [Meeting!]
    coreqs: String
    coreqsObj: Requisite!
    coreqCourses: [[Course]]
    prereqs: String
    prereqsObj: Requisite
    prereqCourses: [[Course]]
    semester: String!
    year: Int!
    units: Int
    rundate: Date
  }

  type Meeting {
    courseId: String!
    name: String
    times: [EventTime!]
    instructors: [String!]
    course: Course!
    type: String
    semester: String!
    year: Int!
    rundate: Date
  }

  type EventTime {
    days: [Int!]
    begin: Int
    end: Int
    building: String
    room: String
    location: String
  }

  type Requisite {
    reqs: [[String!]]
    invert: Boolean
  }

  type Query {
    course(courseId: String!, semester: String!, year: Int!): Course
    courses(filter: CourseFilterInput!, offset: Int, limit: Int): [Course!]
    meetings(filter: MeetingFilterInput!, offset: Int, limit: Int): [Meeting!]
  }
`
