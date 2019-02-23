"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToRegexQuery = stringToRegexQuery;

function stringToRegexQuery(val) {
  return {
    $regex: new RegExp(val)
  };
}