"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mergeObj = function mergeObj(a, b) {
  var newObj = {};

  if (a) {
    Object.keys(a).forEach(function (key) {
      newObj[key] = a[key];
    });
  }

  if (b) {
    Object.keys(b).forEach(function (key) {
      newObj[key] = b[key];
    });
  }

  return newObj;
};
exports.mergeObj = mergeObj;