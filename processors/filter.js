'use strict';
var map = require('lodash/map');
var filter = require('lodash/filter');

function createRegExp(patterns) {
  if (!patterns.length) {
    return /a^/;
  }

  return new RegExp(filter(map(patterns, function(pattern) {
      if (!pattern) {
        return null;
      }

      if (pattern.source) {
        return pattern.source;
      }

      return pattern.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    }), function(pattern) {
        return !!pattern;
      }).join('|'), 'i');
}

function FilterProcessor(options) {
  this.ignoreErrors = createRegExp(options.ignoreErrors || []);
  this.ignoreUrls = createRegExp(options.ignoreUrls || []);
}

FilterProcessor.prototype.process = function(errInfo) {
  var file = errInfo.stacks[0].fileName;
  return !this.ignoreErrors.test(errInfo.message) && !this.ignoreUrls.test(file);
};

module.exports = FilterProcessor;
