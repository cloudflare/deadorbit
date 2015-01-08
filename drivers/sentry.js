'use strict';
var uuid = require('uuid');
var toISOString = require('../lib/toISOString');
var xhr = require('../lib/xhr');
var defined = require('defined');
var map = require('array-map');
var reduce = require('array-reduce');
var version = '1.0.0';

function SentryDriver(options) {
  this.project = options.project;
  this.key = options.key;
  this.secret = options.secret;
  this.server = options.server + '/api/' + this.project + '/store/';
}

var SentryDriverProto = SentryDriver.prototype;

SentryDriverProto.getAuthHeader = function(date) {
  var auth = 'Sentry sentry_version=4, sentry_timestamp=' + date.getTime() + ', sentry_key=' + this.key + ', sentry_client=deadorbit/' + version;

  if (this.secret) {
    auth += ', sentry_secret=' + this.secret;
  }

  return auth;
};

/* errInfo contains the following information:
 *
 * * "stack" an array of exception stacks
 * * "user" information about the current user (if set)
 * * "tags" array or object of application tags
 */
SentryDriverProto.report = function(errInfo) {
  var date = new Date();
  var id = uuid();
  var payload = {
    event_id: id,
    timestamp: toISOString(date),
    level: 'error',
    logger: 'deadorbit',
    project: this.project,
    platform: 'javascript'
  };

  var firstFrame = defined(errInfo.stacks[0], {});
  var lineNumber = firstFrame.lineNumber;
  var message = errInfo.message;

  payload.culprit = firstFrame.functionName;
  payload.message = lineNumber ? message + ' at ' + lineNumber : message + '';


  var stacks = map(errInfo.stacks.reverse(), function(stack) {
    var result = {
      in_app: true
    };

    if (stack.fileName) {
      result.filename = stack.fileName;
    }

    if (stack.functionName) {
      result.function = stack.functionName;
    }

    if (stack.lineNumber) {
      result.lineno = stack.lineNumber;
    }

    if (stack.columnNumber) {
      result.colno = stack.columnNumber;
    }

    if (stack.args) {
      result.vars = reduce(stack.args, function(acc, value, index) {
        acc[index] = value;
        return acc;
      }, {});
    }

    return result;
  });

  if (errInfo.type && errInfo.message) {
    payload.exception = {
      type: errInfo.type,
      message: errInfo.message
    };
  }

  if (stacks.length) {
    payload.stacktrace = {
      frames: stacks
    };
  }

  if (errInfo.user) {
    payload.user = errInfo.user;
  }

  if (errInfo.tags) {
    payload.tags = errInfo.tags;
  }

  if (errInfo.environment) {
    payload.request = errInfo.environment;
  }

  xhr({
    url: this.server,
    method: 'POST',
    headers: {
      'X-Sentry-Auth': this.getAuthHeader(date),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
};

module.exports = SentryDriver;
