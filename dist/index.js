"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CourseApiServer = CourseApiServer;

var _apolloServerExpress = require("apollo-server-express");

var _typeDefs = require("./typeDefs");

var _resolvers = require("./resolvers");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cachegoose = _interopRequireDefault(require("cachegoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function connectMongo(mongoURI) {
  _mongoose.default.connect(mongoURI, {
    useNewUrlParser: true
  });

  (0, _cachegoose.default)(_mongoose.default);
} // CourseApiServer returns an ApolloServer connected to the MongoDB database


function CourseApiServer(mongoURI) {
  var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (debug) {
    _mongoose.default.set('debug', true);
  }

  return new _apolloServerExpress.ApolloServer({
    typeDefs: _typeDefs.typeDefs,
    resolvers: _resolvers.resolvers,
    context: function () {
      var _context = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return connectMongo(mongoURI);

              case 2:
                _context2.t0 = _context2.sent;
                return _context2.abrupt("return", {
                  mongo: _context2.t0
                });

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      function context() {
        return _context.apply(this, arguments);
      }

      return context;
    }(),
    cacheControl: {
      defaultMaxAge: 240
    },
    introspection: true,
    playground: true
  });
}