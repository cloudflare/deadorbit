'use strict';
var expect = require('assume');
var _ = require('lodash');
var stackParser = require('../lib/stack-parser');
var CapturedExceptions = require('./fixtures/capturedExceptions');

function assertStackFrame(actual, expected) {
  expect(actual.getFunctionName()).equals(expected[0], 'expected functionName');

  if (_.isArray(actual.getArgs()) && _.isArray(expected[1])) {
    expect(actual.getArgs()).deep.equals(expected[1], 'expected args');
  } else {
    expect(actual.getArgs()).equals(expected[1], 'expected args');
  }

  expect(actual.getFileName()).equals(expected[2], 'expected fileName');
  expect(actual.getLineNumber()).equals(expected[3], 'expected lineNumber');
  expect(actual.getColumnNumber()).equals(expected[4], 'expected columnNumber');
}

describe('Stack Parser', function() {
  it('should parse Safari 6 Error.stack', function() {
    var stack = stackParser(CapturedExceptions.SAFARI_6);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 48]);
    assertStackFrame(stack[1], ['dumpException3', undefined, 'http://path/to/file.js', 52]);
    assertStackFrame(stack[2], ['onclick', undefined, 'http://path/to/file.js', 82]);
  });

  it('should parse Safari 7 Error.stack', function() {
    var stack = stackParser(CapturedExceptions.SAFARI_7);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 48, 22]);
    assertStackFrame(stack[1], ['foo', undefined, 'http://path/to/file.js', 52, 15]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 108, 107]);
  });

  it('should parse Safari 8 Error.stack', function() {
    var stack = stackParser(CapturedExceptions.SAFARI_8);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 47, 22]);
    assertStackFrame(stack[1], ['foo', undefined, 'http://path/to/file.js', 52, 15]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 108, 23]);
  });

  it('should parse Safari 8 Error.stack with eval', function() {
    var stack = stackParser(CapturedExceptions.SAFARI_8_EVAL);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], ['<eval>']);
    assertStackFrame(stack[1], ['foo', undefined, 'http://path/to/file.js', 58, 21]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 109, 91]);
  });

  it('should parse Firefox 14 Error.stack', function() {
    var stack = stackParser(CapturedExceptions.FIREFOX_14);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 48]);
    assertStackFrame(stack[1], ['dumpException3', undefined, 'http://path/to/file.js', 52]);
    assertStackFrame(stack[2], ['onclick', undefined, 'http://path/to/file.js', 1]);
  });

  it('should parse Firefox 31 Error.stack', function() {
    var stack = stackParser(CapturedExceptions.FIREFOX_31);
    expect(stack).is.ok();
    expect(stack).has.size(2);
    assertStackFrame(stack[0], ['foo', undefined, 'http://path/to/file.js', 41, 13]);
    assertStackFrame(stack[1], ['bar', undefined, 'http://path/to/file.js', 1, 1]);
  });

  it('should parse V8 Error.stack', function() {
    var stack = stackParser(CapturedExceptions.CHROME_15);
    expect(stack).is.ok();
    expect(stack).has.size(4);
    assertStackFrame(stack[0], ['bar', undefined, 'http://path/to/file.js', 13, 17]);
    assertStackFrame(stack[1], ['bar', undefined, 'http://path/to/file.js', 16, 5]);
    assertStackFrame(stack[2], ['foo', undefined, 'http://path/to/file.js', 20, 5]);
    assertStackFrame(stack[3], [undefined, undefined, 'http://path/to/file.js', 24, 4]);
  });

  it('should parse V8 Error.stack with port numbers', function() {
    var stack = stackParser(CapturedExceptions.CHROME_36);
    expect(stack).is.ok();
    expect(stack).has.size(2);
    assertStackFrame(stack[0], ['dumpExceptionError', undefined, 'http://localhost:8080/file.js', 41, 27]);
  });

  it('should parse V8 Error.stack with eval', function() {
    var stack = stackParser(CapturedExceptions.CHROME_41_EVAL);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], ['<eval>']);
    assertStackFrame(stack[1], ['foo', undefined, 'http://path/to/file.js', 12, 3]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 63, 1]);
  });

  it('should parse V8 Error.stack with native components', function() {
    var stack = stackParser(CapturedExceptions.CHROME_41_NATIVE);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], ['setConfig', undefined, 'http://path/to/file.js', 9583, 43]);
    assertStackFrame(stack[1], ['Array.map', undefined]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 55210, 56]);
  });

  it('should parse IE 10 Error stacks', function() {
    var stack = stackParser(CapturedExceptions.IE_10);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 48, 13]);
    assertStackFrame(stack[1], ['foo', undefined, 'http://path/to/file.js', 46, 9]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 82, 1]);
  });

  it('should parse IE 11 Error stacks', function() {
    var stack = stackParser(CapturedExceptions.IE_11);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 47, 21]);
    assertStackFrame(stack[1], ['foo', undefined, 'http://path/to/file.js', 45, 13]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 108, 1]);
  });

  it('should parse IE 11 Error stacks with eval', function() {
    var stack = stackParser(CapturedExceptions.IE_11_EVAL);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], ['<eval>']);
    assertStackFrame(stack[1], ['foo', undefined, 'http://path/to/file.js', 58, 17]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 109, 1]);
  });

  it('should parse Opera 9.27 Error messages', function() {
    var stack = stackParser(CapturedExceptions.OPERA_927);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 43]);
    assertStackFrame(stack[1], [undefined, undefined, 'http://path/to/file.js', 31]);
    assertStackFrame(stack[2], [undefined, undefined, 'http://path/to/file.js', 18]);
  });

  it('should parse Opera 10 Error messages', function() {
    var stack = stackParser(CapturedExceptions.OPERA_10);
    expect(stack).is.ok();
    expect(stack).has.size(7);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 42]);
    assertStackFrame(stack[1], [undefined, undefined, 'http://path/to/file.js', 27]);
    assertStackFrame(stack[2], ['printStackTrace', undefined, 'http://path/to/file.js', 18]);
    assertStackFrame(stack[3], ['bar', undefined, 'http://path/to/file.js', 4]);
    assertStackFrame(stack[4], ['bar', undefined, 'http://path/to/file.js', 7]);
    assertStackFrame(stack[5], ['foo', undefined, 'http://path/to/file.js', 11]);
    assertStackFrame(stack[6], [undefined, undefined, 'http://path/to/file.js', 15]);
  });

  it('should parse Opera 11 Error messages', function() {
    var stack = stackParser(CapturedExceptions.OPERA_11);
    expect(stack).is.ok();
    expect(stack).has.size(4);
    assertStackFrame(stack[0], ['run', undefined, 'http://path/to/file.js', 27]);
    assertStackFrame(stack[1], ['bar', undefined, 'http://domain.com:1234/path/to/file.js', 18]);
    assertStackFrame(stack[2], ['foo', undefined, 'http://domain.com:1234/path/to/file.js', 11]);
    assertStackFrame(stack[3], [undefined, undefined, 'http://path/to/file.js', 15]);
  });

  it('should parse Opera 25 Error messages', function() {
    var stack = stackParser(CapturedExceptions.OPERA_25);
    expect(stack).is.ok();
    expect(stack).has.size(3);
    assertStackFrame(stack[0], [undefined, undefined, 'http://path/to/file.js', 47, 22]);
    assertStackFrame(stack[1], ['foo', undefined, 'http://path/to/file.js', 52, 15]);
    assertStackFrame(stack[2], ['bar', undefined, 'http://path/to/file.js', 108, 168]);
  });

  it('should return an empty stack if unable to parse Error', function() {
    var stack = stackParser(CapturedExceptions.FAIL_CASE);
    expect(stack).is.ok();
    expect(stack).has.size(0);
  });

  it('should return an empty stack if passed argument is not like an Error', function() {
    var stack = stackParser('String without Error.stack');
    expect(stack).is.ok();
    expect(stack).has.length(0);
  });

  it('should return an empty stack if no argument is passed', function() {
    var stack = stackParser();
    expect(stack).is.ok();
    expect(stack).has.length(0);
  });
});
