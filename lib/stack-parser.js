'use strict';

var StackFrame = require('stackframe');
var FIREFOX_SAFARI_STACK_REGEXP = /\S+:\d+/;
var CHROME_IE_STACK_REGEXP = /\s+at /;
var SAFARI_EVAL_REGEXP = /^eval@\[native code]/;
var CHROME_IE_EVAL_REGEXP = /\s+at eval/;
var map = require('array-map');
var filter = require('array-filter');

function parse(err) {
  if (!err) {
    return [];
  }

  if (typeof err.stacktrace !== 'undefined' || typeof err['opera#sourceloc'] !== 'undefined') {
    return parseOpera(err);
  }

  if (err.stack && err.stack.match(CHROME_IE_STACK_REGEXP)) {
    return parseV8OrIE(err);
  }

  if (err.stack && err.stack.match(FIREFOX_SAFARI_STACK_REGEXP)) {
    return parseFFOrSafari(err);
  }

  return [];
}

function extractLocation(urlLike) {
  var locationParts = urlLike.split(':');
  var lineNumber;
  var lastNumber;
  var possibleNumber;

  if (locationParts.length > 1) {
    lastNumber = locationParts.pop();
    possibleNumber = locationParts[locationParts.length - 1];
    if (!isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber)) {
      lineNumber = locationParts.pop();
      return [locationParts.join(':'), lineNumber, lastNumber];
    }

    return [locationParts.join(':'), lastNumber];
  }

  return [];
}

// Opera
function parseOpera(err) {
  if (!err.stacktrace || (err.message.indexOf('\n') > -1 && err.message.split('\n').length > err.stacktrace.split('\n').length)) {
    return parseOpera9(err);
  }

  if (!err.stack) {
    return parseOpera10a(err);
  }

  return parseOpera11(err);
}

function parseOpera9(err) {
  var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
  var lines = err.message.split('\n');
  var result = [];

  for (var i = 2, len = lines.length; i < len; i += 2) {
    var match = lineRE.exec(lines[i]);

    if (match) {
      result.push(new StackFrame(undefined, undefined, match[2], match[1]));
    }
  }

  return result;
}

function parseOpera10a(err) {
  var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
  var lines = err.stacktrace.split('\n');
  var result = [];

  for (var i = 0, len = lines.length; i < len; i += 2) {
    var match = lineRE.exec(lines[i]);
    if (match) {
      result.push(new StackFrame(match[3] || undefined, undefined, match[2], match[1]));
    }
  }

  return result;
}

function parseOpera11(err) {
  var lines = err.stack.split('\n');
  lines = filter(lines, function(line) {
    return line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
  });

  return map(lines, function(line) {
    var tokens = line.split('@');
    var locationParts = extractLocation(tokens.pop());
    var functionCall = (tokens.shift() || '');
    var functionName = functionCall
        .replace(/<anonymous function(: (\w+))?>/, '$2')
        .replace(/\([^\)]*\)/g, '') || undefined;
    var argsRaw;

    if (functionCall.match(/\(([^\)]*)\)/)) {
      argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
    }

    var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ? undefined : argsRaw.split(',');

    return new StackFrame(functionName, args, locationParts[0], locationParts[1], locationParts[2]);
  });
}

// V8 or IE
function parseV8OrIE(err) {
  var lines = err.stack.split('\n').slice(1);

  return map(lines, function(line) {
    if (line.match(CHROME_IE_EVAL_REGEXP)) {
      return new StackFrame('<eval>');
    }

    var tokens = line.replace(/^\s+/, '').split(/\s+/).slice(1);
    var locationParts = extractLocation(tokens.pop().replace(/[\(\)\s]/g, ''));
    var functionName = (!tokens[0] || tokens[0] === 'Anonymous') ? undefined : tokens[0];
    return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2]);
  });
}

// Firefox or Safari
function parseFFOrSafari(err) {
  var lines = err.stack.split('\n');
  lines = filter(lines, function(line) {
    return line.match(FIREFOX_SAFARI_STACK_REGEXP) || line.match(SAFARI_EVAL_REGEXP);
  });

  return map(lines, function(line) {
    if (line.match(SAFARI_EVAL_REGEXP)) {
      return new StackFrame('<eval>');
    }

    var tokens = line.split('@');
    var locationParts = extractLocation(tokens.pop());
    var functionName = tokens.shift() || undefined;

    return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2]);
  });
}

module.exports = parse;
