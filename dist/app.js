"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _index = require("./index");

var dbName = process.env.DB_NAME || 'courseapi';
var mongoUri = process.env.MONGO_URI || "mongodb+srv://test-a:nebku0-hYpqeq-qagmuh@cluster0-ydk8h.mongodb.net/".concat(dbName, "?retryWrites=true");
var port = process.env.PORT || 4000; // DEBUG

var DEBUG = process.env.NODE_ENV !== 'production';
var server = new _index.CourseApiServer(mongoUri, DEBUG);
var app = (0, _express.default)();
server.applyMiddleware({
  app: app
}); // app is from an existing express app

app.listen({
  port: port
}, function () {
  // eslint-disable-next-line no-console
  console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(port).concat(server.graphqlPath));
});