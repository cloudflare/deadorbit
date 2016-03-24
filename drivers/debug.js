'use strict';
var debug = require('debug');
var forEach = require('lodash/forEach');

function DebugDriver(options) {
  options = options || {};
  this.debug = debug(options.namespace || 'deadorbit.driver.debug:log');
}

function prettify(stacks) {
  var string = '\n';
  forEach(stacks, function (stack) {
    var functionName = stack.functionName;
    var fileName = stack.fileName;
    var lineNumber = stack.lineNumber;
    var columnNumber = stack.columnNumber;
    var str;

    if (functionName) {
      str = '\tat ' + functionName;

      if (fileName) {
        str += ' (' + fileName;

        if (lineNumber) {
          str += ':' + lineNumber;

          if (columnNumber) {
            str += ':' + columnNumber;
          }
        }

        str += ')';
      }

      str += '\n';

      string += str;
    }
  });

  return string;
}

DebugDriver.prototype.report = function (errInfo) {
  this.debug('%s: %s', errInfo.type, errInfo.message, prettify(errInfo.stacks));
};

module.exports = DebugDriver;
