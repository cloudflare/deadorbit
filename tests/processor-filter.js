'use strict';
var expect = require('assume');
var FilterProcessor = require('../processors/filter');

describe('Filter Processor', function () {
  var errInfo;

  beforeEach(function () {
    errInfo = {
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
    };
  });

  it('should not return false if no filters are provided', function () {
    var options = {};
    var filterProcessor = new FilterProcessor(options);

    expect(filterProcessor.process(errInfo)).is.not.false();
  });

  it('should return false if ignoreErrors string is matched', function () {
    var options = {
      ignoreErrors: [
        'Engram is an Ascendant Energy'
      ]
    };
    var filterProcessor = new FilterProcessor(options);

    expect(filterProcessor.process(errInfo)).is.false();
  });

  it('should return false if ignoreErrors regex is matched', function () {
    var options = {
      ignoreErrors: [
        /Engram is an Ascendant \w+$/
      ]
    };
    var filterProcessor = new FilterProcessor(options);

    expect(filterProcessor.process(errInfo)).is.false();
  });

  it('should return false if ignoreUrls string is matched', function () {
    var options = {
      ignoreUrls: [
        'decode-engram.js'
      ]
    };
    var filterProcessor = new FilterProcessor(options);

    expect(filterProcessor.process(errInfo)).is.false();
  });

  it('should return false if ignoreUrls regex is matched', function () {
    var options = {
      ignoreUrls: [
        /engram.js$/
      ]
    };
    var filterProcessor = new FilterProcessor(options);

    expect(filterProcessor.process(errInfo)).is.false();
  });

  it('should not return false if none of ignoreErrors or ignoreUrls match', function () {
    var options = {
      ignoreUrls: [
        /test1.js$/,
        /test2.js$/,
        'test3.js'
      ],
      ignoreErrors: [
        /cheesing/,
        /rng/,
        'missions'
      ]
    };
    var filterProcessor = new FilterProcessor(options);

    expect(filterProcessor.process(errInfo)).is.not.false();
  });

  it('should return false if any ignoreUrls match', function () {
    var options = {
      ignoreUrls: [
        /test1.js$/,
        /test2.js$/,
        'test3.js',
        /engram.js$/
      ],
      ignoreErrors: [
        /cheesing/,
        /rng/,
        'missions'
      ]
    };

    var filterProcessor = new FilterProcessor(options);

    expect(filterProcessor.process(errInfo)).is.false();
  });

  it('should return false if any ignoreErrors match', function () {
    var options = {
      ignoreUrls: [
        /test1.js$/,
        /test2.js$/,
        'test3.js'
      ],
      ignoreErrors: [
        /cheesing/,
        /rng/,
        'missions',
        /Engram is an Ascendant \w+$/
      ]
    };

    var filterProcessor = new FilterProcessor(options);

    expect(filterProcessor.process(errInfo)).is.false();
  });
});
