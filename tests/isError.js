'use strict';
var expect = require('assume');
var isError = require('../lib/isError');

describe('isError', function() {
  it('should report true for Error', function() {
    expect(isError(new Error())).is.true();
  });

  it('should report true for an error inheriting from Error', function() {
    expect(isError(new ReferenceError())).is.true();
  });

  it('should report false for non-Errors', function() {
    expect(isError('')).is.false();
    expect(isError(true)).is.false();
    expect(isError(24)).is.false();
    expect(isError([])).is.false();
    expect(isError({})).is.false();
  });

  it('should report false for Objects that look like Errors', function() {
    expect(isError({
      message: 'Unhandled Error',
      name: 'Error',
      stack: 'Error: Unhandled Error'
    })).is.false();
  });
});
