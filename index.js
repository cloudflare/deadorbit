'use strict';
var stackParser = require('./lib/stack-parser');
var stackGenerator = require('stack-generator');
var isError = require('./lib/isError');

function DeadOrbit(driver, processor) {
  this.driver = driver;
  this.processor = processor;
}

var DeadOrbitPrototype = DeadOrbit.prototype;

DeadOrbitPrototype.report = function(err, options) {
  if (!err || (!isError(err) && !err.message)) {
    throw new Error('Error instance or error stub required');
  }

  var errInfo = {};
  options = options || {};

  if (isError(err)) {
    /* istanbul ignore else */
    if ( /* istanbul ignore else */ err.stack || err['opera#sourceloc']) {
      errInfo.stacks = stackParser(err);
    } else {
      errInfo.stacks = stackGenerator.backtrace();
    }
  } else {
    errInfo.stacks = [{
      fileName: err.fileName,
      lineNumber: err.lineNo,
      columnNumber: err.colNo
    }];
  }

  errInfo.message = err.message;
  errInfo.type = err.name;
  errInfo.tags = options.tags;
  errInfo.user = options.user;

  if (this.processor && (this.processor.process(errInfo) === false)) {
    return;
  }

  this.driver.report(errInfo);
};

module.exports = DeadOrbit;
