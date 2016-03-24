'use strict';
var expect = require('assume');
var DebugDriver = require('../drivers/debug');
var debug = require('debug');
var sinon = require('sinon');

var reLog = /^(%c)?deadorbit.driver.debug:log (%c)?%s: %s(%c)? \+\dms$/;

describe('Debug Driver', function () {
  it('should set default namespace', function () {
    var debugDriver = new DebugDriver();

    expect(debugDriver.debug.namespace).equals('deadorbit.driver.debug:log');
  });

  it('should set custom namespace', function () {
    var namespace = 'deadorbit.custom.namespace:silly';
    var debugDriver = new DebugDriver({
      namespace: namespace
    });

    expect(debugDriver.debug.namespace).equals(namespace);
  });

  it('should parse errors and create log line', function () {
    // Enable the namespace for `debug` logging.
    debug.enable('deadorbit.driver.debug:log');

    var debugDriver = new DebugDriver();
    var spy = sinon.spy();
    debugDriver.debug.log = spy;

    debugDriver.report({
      message: 'Engram is an Ascendant Energy',
      type: 'RahoolError',
      stacks: [{
        functionName: 'decodeEngram',
        fileName: 'decode-engram.js',
        lineNumber: '34',
        columnNumber: '5'
      }, {
        functionName: 'decode',
        fileName: 'cryptarch.js',
        lineNumber: '89',
        columnNumber: '17'
      }]
    });

    var args = spy.firstCall.args;

    expect(spy.calledOnce).is.true();
    expect(args[0]).matches(reLog);

    var matches = args[0].match(reLog);

    // if the log line contains colors
    if (matches[1]) {
      expect(args[1]).matches(/^color:/);
      expect(args[2]).matches(/^color:/);
      expect(args[3]).equals('RahoolError');
      expect(args[4]).equals('Engram is an Ascendant Energy');
      expect(args[5]).matches(/^color:/);
      expect(args[6]).equals('\n\tat decodeEngram (decode-engram.js:34:5)\n\tat decode (cryptarch.js:89:17)\n');
    } else {
      expect(args[1]).equals('RahoolError');
      expect(args[2]).equals('Engram is an Ascendant Energy');
      expect(args[3]).equals('\n\tat decodeEngram (decode-engram.js:34:5)\n\tat decode (cryptarch.js:89:17)\n');
    }
  });

  it('should parse errors and create log line without columnNumber', function () {
    // Enable the namespace for `debug` logging.
    debug.enable('deadorbit.driver.debug:log');

    var debugDriver = new DebugDriver();
    var spy = sinon.spy();
    debugDriver.debug.log = spy;

    debugDriver.report({
      message: 'Engram is an Ascendant Energy',
      type: 'RahoolError',
      stacks: [{
        functionName: 'decodeEngram',
        fileName: 'decode-engram.js',
        lineNumber: '34'
      }, {
        functionName: 'decode',
        fileName: 'cryptarch.js',
        lineNumber: '89'
      }]
    });

    var args = spy.firstCall.args;

    expect(spy.calledOnce).is.true();
    expect(args[0]).matches(reLog);

    var matches = args[0].match(reLog);

    // if the log line contains colors
    if (matches[1]) {
      expect(args[1]).matches(/^color:/);
      expect(args[2]).matches(/^color:/);
      expect(args[3]).equals('RahoolError');
      expect(args[4]).equals('Engram is an Ascendant Energy');
      expect(args[5]).matches(/^color:/);
      expect(args[6]).equals('\n\tat decodeEngram (decode-engram.js:34)\n\tat decode (cryptarch.js:89)\n');
    } else {
      expect(args[1]).equals('RahoolError');
      expect(args[2]).equals('Engram is an Ascendant Energy');
      expect(args[3]).equals('\n\tat decodeEngram (decode-engram.js:34)\n\tat decode (cryptarch.js:89)\n');
    }
  });

  it('should parse errors and create log line without lineNumber', function () {
    // Enable the namespace for `debug` logging.
    debug.enable('deadorbit.driver.debug:log');

    var debugDriver = new DebugDriver();
    var spy = sinon.spy();
    debugDriver.debug.log = spy;

    debugDriver.report({
      message: 'Engram is an Ascendant Energy',
      type: 'RahoolError',
      stacks: [{
        functionName: 'decodeEngram',
        fileName: 'decode-engram.js'
      }, {
        functionName: 'decode',
        fileName: 'cryptarch.js'
      }]
    });

    var args = spy.firstCall.args;

    expect(spy.calledOnce).is.true();
    expect(args[0]).matches(reLog);

    var matches = args[0].match(reLog);

    // if the log line contains colors
    if (matches[1]) {
      expect(args[1]).matches(/^color:/);
      expect(args[2]).matches(/^color:/);
      expect(args[3]).equals('RahoolError');
      expect(args[4]).equals('Engram is an Ascendant Energy');
      expect(args[5]).matches(/^color:/);
      expect(args[6]).equals('\n\tat decodeEngram (decode-engram.js)\n\tat decode (cryptarch.js)\n');
    } else {
      expect(args[1]).equals('RahoolError');
      expect(args[2]).equals('Engram is an Ascendant Energy');
      expect(args[3]).equals('\n\tat decodeEngram (decode-engram.js)\n\tat decode (cryptarch.js)\n');
    }
  });

  it('should parse errors and create log line without fileName', function () {
    // Enable the namespace for `debug` logging.
    debug.enable('deadorbit.driver.debug:log');

    var debugDriver = new DebugDriver();
    var spy = sinon.spy();
    debugDriver.debug.log = spy;

    debugDriver.report({
      message: 'Engram is an Ascendant Energy',
      type: 'RahoolError',
      stacks: [{
        functionName: 'decodeEngram'
      }, {
        functionName: 'decode'
      }]
    });

    var args = spy.firstCall.args;

    expect(spy.calledOnce).is.true();
    expect(args[0]).matches(reLog);

    var matches = args[0].match(reLog);

    // if the log line contains colors
    if (matches[1]) {
      expect(args[1]).matches(/^color:/);
      expect(args[2]).matches(/^color:/);
      expect(args[3]).equals('RahoolError');
      expect(args[4]).equals('Engram is an Ascendant Energy');
      expect(args[5]).matches(/^color:/);
      expect(args[6]).equals('\n\tat decodeEngram\n\tat decode\n');
    } else {
      expect(args[1]).equals('RahoolError');
      expect(args[2]).equals('Engram is an Ascendant Energy');
      expect(args[3]).equals('\n\tat decodeEngram\n\tat decode\n');
    }
  });

  it('should parse errors and create log line without functionName', function () {
    // Enable the namespace for `debug` logging.
    debug.enable('deadorbit.driver.debug:log');

    var debugDriver = new DebugDriver();
    var spy = sinon.spy();
    debugDriver.debug.log = spy;

    debugDriver.report({
      message: 'Engram is an Ascendant Energy',
      type: 'RahoolError',
      stacks: [{}]
    });

    var args = spy.firstCall.args;

    expect(spy.calledOnce).is.true();
    expect(args[0]).matches(reLog);

    var matches = args[0].match(reLog);

    // if the log line contains colors
    if (matches[1]) {
      expect(args[1]).matches(/^color:/);
      expect(args[2]).matches(/^color:/);
      expect(args[3]).equals('RahoolError');
      expect(args[4]).equals('Engram is an Ascendant Energy');
      expect(args[5]).matches(/^color:/);
      expect(args[6]).equals('\n');
    } else {
      expect(args[1]).equals('RahoolError');
      expect(args[2]).equals('Engram is an Ascendant Energy');
      expect(args[3]).equals('\n');
    }
  });
});
