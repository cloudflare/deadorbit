'use strict';
var expect = require('assume');
var CompositeProcessor = require('../processors/composite');
var sinon = require('sinon');

function SampleProcessor() {
  this.process = sinon.stub();
}

describe('Composite Processor', function () {
  it('should forward reports to component processor', function () {
    var sampleReporter1 = new SampleProcessor();
    var sampleReporter2 = new SampleProcessor();
    var composite = new CompositeProcessor([sampleReporter1, sampleReporter2]);
    var errInfo = {
      error: true
    };

    expect(composite.process(errInfo)).is.not.false();

    expect(sampleReporter1.process.calledOnce).is.true();
    expect(sampleReporter2.process.calledOnce).is.true();

    expect(sampleReporter1.process.firstCall.calledWithExactly(errInfo)).is.true();
    expect(sampleReporter2.process.firstCall.calledWithExactly(errInfo)).is.true();
  });

  it('should not forward reports to second processor if the first returns false', function () {
    var sampleReporter1 = new SampleProcessor();
    var sampleReporter2 = new SampleProcessor();

    sampleReporter1.process.returns(false);

    var composite = new CompositeProcessor([sampleReporter1, sampleReporter2]);

    var errInfo = {
      error: true
    };

    expect(composite.process(errInfo)).is.false();

    expect(sampleReporter1.process.calledOnce).is.true();
    expect(sampleReporter2.process.called).is.false();

    expect(sampleReporter1.process.firstCall.calledWithExactly(errInfo)).is.true();
  });
});
