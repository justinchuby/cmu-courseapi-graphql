"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  scalar Date\n\n  input CourseFilterInput {\n    text: String\n    courseId: String\n    department: String\n    semester: String\n    year: Int\n    year_gt: Int\n    year_gte: Int\n    year_lt: Int\n    year_lte: Int\n    coreq: String\n    prereq: String\n  }\n\n  input MeetingFilterInput {\n    courseId: String\n    name: String\n    semester: String\n    year: Int\n    year_gt: Int\n    year_gte: Int\n    year_lt: Int\n    year_lte: Int\n    day: Int\n    begin: Int\n    begin_gt: Int\n    begin_gte: Int\n    begin_lt: Int\n    begin_lte: Int\n    end: Int\n    end_gt: Int\n    end_gte: Int\n    end_lt: Int\n    end_lte: Int\n    building: String\n    room: String\n    location: String\n    instructor: String\n    type: String\n  }\n\n  type Course {\n    courseId: String!\n    desc: String\n    name: String\n    notes: String\n    department: String\n    meetings: [Meeting!]\n    coreqs: String\n    coreqsObj: Requisite!\n    coreqCourses: [[Course]]\n    prereqs: String\n    prereqsObj: Requisite\n    prereqCourses: [[Course]]\n    semester: String!\n    year: Int!\n    units: Int\n    rundate: Date\n  }\n\n  type Meeting {\n    courseId: String!\n    name: String\n    times: [EventTime!]\n    instructors: [String!]\n    course: Course!\n    type: String\n    semester: String!\n    year: Int!\n    rundate: Date\n  }\n\n  type EventTime {\n    days: [Int!]\n    begin: Int\n    end: Int\n    building: String\n    room: String\n    location: String\n  }\n\n  type Requisite {\n    reqs: [[String!]]\n    invert: Boolean\n  }\n\n  type Query {\n    course(courseId: String!, semester: String!, year: Int!): Course\n    courses(filter: CourseFilterInput!, offset: Int, limit: Int): [Course!]\n    meetings(filter: MeetingFilterInput!, offset: Int, limit: Int): [Meeting!]\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

// The GraphQL schema
var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
exports.typeDefs = typeDefs;