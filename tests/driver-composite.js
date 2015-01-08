'use strict';
var expect = require('assume');
var CompositeDriver = require('../drivers/composite');
var sinon = require('sinon');

function SampleReporter() {
  this.report = sinon.spy();
}

describe('Composite Driver', function() {
  it('should forward reports to component drivers', function() {
    var sampleReporter1 = new SampleReporter();
    var sampleReporter2 = new SampleReporter();
    var composite = new CompositeDriver([sampleReporter1, sampleReporter2]);
    var errInfo = {
      error: true
    };

    composite.report(errInfo);

    expect(sampleReporter1.report.calledOnce).is.true();
    expect(sampleReporter2.report.calledOnce).is.true();

    expect(sampleReporter1.report.firstCall.calledWithExactly(errInfo)).is.true();
    expect(sampleReporter2.report.firstCall.calledWithExactly(errInfo)).is.true();
  });
});
