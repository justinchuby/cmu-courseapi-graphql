"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _graphql = require("graphql");

var _models = require("./models");

var _graphqlMongoHelpers = require("@entria/graphql-mongo-helpers");

var _mongoHelpers = require("./mongoHelpers");

// TODO: put this elsewhere
var CACHE_TTL = 60;
var dateScalarType = new _graphql.GraphQLScalarType({
  // https://www.apollographql.com/docs/graphql-tools/scalars.html#Date-as-a-scalar
  name: 'Date',
  description: 'The Javascript native Date type.',
  parseValue: function parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize: function serialize(value) {
    return value.toJSON(); // value sent to the client
  },
  parseLiteral: function parseLiteral(ast) {
    return new Date(ast.value);
  }
}); // Mappings for translating graphQL input to MongoDB queries

var courseFilterMapping = {
  text: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: function format(val) {
      return {
        $text: {
          $search: val
        }
      };
    }
  },
  courseId: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: _mongoHelpers.stringToRegexQuery
  },
  coreq: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: function format(val) {
      var regex = new RegExp(val);
      return {
        'coreqsObj.reqs': {
          $elemMatch: {
            $elemMatch: {
              $in: [regex]
            }
          }
        }
      };
    }
  },
  prereq: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: function format(val) {
      var regex = new RegExp(val);
      return {
        'prereqsObj.reqs': {
          $elemMatch: {
            $elemMatch: {
              $in: [regex]
            }
          }
        }
      };
    }
  }
};
var meetingFilterMapping = {
  instructor: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: function format(val) {
      var names = val.split(' ');
      var regexes = names.map(function (e) {
        return new RegExp(e, 'i');
      });
      return {
        $and: [{
          $text: {
            $search: val
          }
        }, {
          instructors: {
            $all: regexes
          }
        }]
      };
    }
  },
  courseId: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: _mongoHelpers.stringToRegexQuery
  },
  day: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.days',
    format: function format(val) {
      return {
        $in: [val]
      };
    }
  },
  begin: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.begin'
  },
  end: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.end'
  },
  building: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.building'
  },
  room: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.room'
  },
  location: {
    type: _graphqlMongoHelpers.FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'times.location'
  } // TODO: data verification

};

function reqQuery(collection, reqsList, semester, year) {
  return reqsList.map(function (reqGroup) {
    return reqGroup.map(
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(req) {
        var result;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return collection.findOne({
                  courseId: req,
                  semester: semester,
                  year: year
                }).lean().cache(CACHE_TTL).exec();

              case 2:
                result = _context.sent;

                if (!result) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", result);

              case 5:
                return _context.abrupt("return", collection.findOne({
                  courseId: req
                }).sort({
                  year: -1
                }).lean().cache(CACHE_TTL).exec());

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  });
} // A map of functions which return data for the schema.


var resolvers = {
  Date: dateScalarType,
  Course: {
    meetings: function meetings(_ref2) {
      var courseId = _ref2.courseId,
          semester = _ref2.semester,
          year = _ref2.year;
      return _models.Meeting.find({
        courseId: courseId,
        semester: semester,
        year: year
      }).lean().cache(CACHE_TTL).exec();
    },
    coreqCourses: function coreqCourses(_ref3) {
      var coreqsObj = _ref3.coreqsObj,
          semester = _ref3.semester,
          year = _ref3.year;
      var reqs = coreqsObj.reqs;

      if (reqs) {
        return reqQuery(_models.Course, reqs, semester, year);
      }

      return null;
    },
    prereqCourses: function prereqCourses(_ref4) {
      var prereqsObj = _ref4.prereqsObj,
          semester = _ref4.semester,
          year = _ref4.year;
      var reqs = prereqsObj.reqs;

      if (reqs) {
        return reqQuery(_models.Course, reqs, semester, year);
      }

      return null;
    }
  },
  Meeting: {
    course: function course(_ref5) {
      var courseId = _ref5.courseId,
          semester = _ref5.semester,
          year = _ref5.year;
      return _models.Course.findOne({
        courseId: courseId,
        semester: semester,
        year: year
      }).lean().cache(CACHE_TTL).exec();
    }
  },
  Query: {
    course: function course(root, args) {
      var courseId = args.courseId,
          semester = args.semester,
          year = args.year;
      return _models.Course.findOne({
        courseId: courseId,
        semester: semester,
        year: year
      }).lean().cache(CACHE_TTL).exec();
    },
    courses: function courses(root, args) {
      var filter = args.filter,
          offset = args.offset,
          limit = args.limit;
      var filterResult = (0, _graphqlMongoHelpers.buildMongoConditionsFromFilters)(null, filter, courseFilterMapping);
      var query;

      if (filterResult.conditions.hasOwnProperty('$text')) {
        // If the filter contains a text search query
        // Sort result based on score
        query = _models.Course.find(filterResult.conditions, {
          score: {
            $meta: 'textScore'
          }
        }).sort({
          score: {
            $meta: 'textScore'
          }
        }).skip(offset).limit(limit);
      } else {
        // No text search query
        query = _models.Course.find(filterResult.conditions).cache(CACHE_TTL).skip(offset).limit(limit);
      }

      return query.lean().exec();
    },
    meetings: function meetings(root, args) {
      var filter = args.filter,
          offset = args.offset,
          limit = args.limit;
      var filterResult = (0, _graphqlMongoHelpers.buildMongoConditionsFromFilters)(null, filter, meetingFilterMapping);
      return _models.Meeting.find(filterResult.conditions).skip(offset).limit(limit).lean().cache(CACHE_TTL).exec();
    }
  }
};
exports.resolvers = resolvers;