'use strict';
var isObject = require('./isObject');

module.exports = function isError(err) {
  return isObject(err) && Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error;
};
