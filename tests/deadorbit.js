'use strict';
var expect = require('assume');
var DeadOrbit = require('../');
var sinon = require('sinon');

function SampleReporter() {
  this.report = sinon.spy();
}

describe('deadorbit', function() {
  it('should accept a Driver', function() {
    var sampleReporter = new SampleReporter();
    var deadOrbit = new DeadOrbit(sampleReporter);

    expect(deadOrbit.driver).equals(sampleReporter);
  });

  it('should parse Error', function() {
    var sampleReporter = new SampleReporter();
    var deadOrbit = new DeadOrbit(sampleReporter);

    var error = new ReferenceError('Unable to Cheese');

    deadOrbit.report(error);

    expect(sampleReporter.report.calledOnce).is.true();

    var errInfo = sampleReporter.report.firstCall.args[0];
    expect(errInfo).is.an('object');
    expect(errInfo.message).equals(error.message);
    expect(errInfo.type).equals(error.name);
    expect(errInfo.stacks).is.an('array');
    expect(errInfo.stacks).is.above(0);
  });

  it('should parse error stub', function() {
    var sampleReporter = new SampleReporter();
    var deadOrbit = new DeadOrbit(sampleReporter);

    var error = {
      message: 'Guardians want different weapons',
      name: 'XurError',
      fileName: 'xur.js',
      lineNo: '34',
      colNo: '20'
    };

    deadOrbit.report(error);

    expect(sampleReporter.report.calledOnce).is.true();

    var errInfo = sampleReporter.report.firstCall.args[0];
    expect(errInfo).is.an('object');
    expect(errInfo.message).equals(error.message);
    expect(errInfo.type).equals(error.name);
    expect(errInfo.stacks).is.an('array');
    expect(errInfo.stacks).has.size(1);
    expect(errInfo.stacks[0].fileName).equals(error.fileName);
    expect(errInfo.stacks[0].lineNumber).equals(error.lineNo);
    expect(errInfo.stacks[0].columnNumber).equals(error.colNo);
  });

  it('should throw if no error', function() {
    var sampleReporter = new SampleReporter();
    var deadOrbit = new DeadOrbit(sampleReporter);

    expect(function() {
      deadOrbit.report();
    }).throws(/Error instance or error stub required/);
  });
});
