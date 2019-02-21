import mongoose from 'mongoose'

export const Course = mongoose.model(
  'Course',
  {
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
  },
  'courses'
)

export const Meeting = mongoose.model(
  'Meeting',
  {
    courseId: String,
    name: String,
    times: {
      days: [Number],
      begin: Number,
      end: Number,
      building: String,
      room: String,
      location: String
    },
    instructors: [String],
    type: String,
    semester: String,
    year: Number,
    rundate: Date
  },
  'meetings'
)