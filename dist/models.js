"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Meeting = exports.Course = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Course = _mongoose.default.model('Course', {
  courseId: String,
  desc: String,
  name: String,
  notes: String,
  department: String,
  coreqs: String,
  coreqsObj: {
    invert: Boolean,
    reqs: [[String]]
  },
  prereqs: String,
  prereqsObj: {
    invert: Boolean,
    reqs: [[String]]
  },
  semester: String,
  year: Number,
  units: Number,
  rundate: Date
}, 'courses');

exports.Course = Course;

var Meeting = _mongoose.default.model('Meeting', {
  courseId: String,
  name: String,
  times: [{
    days: [Number],
    begin: Number,
    end: Number,
    building: String,
    room: String,
    location: String
  }],
  instructors: [String],
  type: String,
  semester: String,
  year: Number,
  rundate: Date
}, 'meetings');

exports.Meeting = Meeting;