"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CourseApiServer = CourseApiServer;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _apolloServerExpress = require("apollo-server-express");

var _typeDefs = require("./typeDefs");

var _resolvers = require("./resolvers");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cachegoose = _interopRequireDefault(require("cachegoose"));

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
      var _context = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context2) {
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