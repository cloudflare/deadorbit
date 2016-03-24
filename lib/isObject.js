'use strict';

module.exports = function (value) {
  var type = typeof value;
  return type === 'function' || (value && type === 'object') || false;
};
