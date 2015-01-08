'use strict';
var expect = require('assume');
var isObject = require('../lib/isObject');

describe('isObject', function() {
  it('should report true for objects', function() {
    expect(isObject({})).is.true();
  });

  it('should report true for arrays', function() {
    expect(isObject([])).is.true();
  });

  it('should report true for functions', function() {
    expect(isObject(function() {})).is.true();
  });

  it('should report true for regexes', function() {
    expect(isObject(/hel{1,2}/)).is.true();
  });

  it('should report true for Number instances', function() {
    /* eslint-disable no-new-wrappers */
    expect(isObject(new Number(2))).is.true();
    /* eslint-enable no-new-wrappers */
  });

  it('should report true for String instances', function() {
    /* eslint-disable no-new-wrappers */
    expect(isObject(new String('A strin'))).is.true();
    /* eslint-enable no-new-wrappers */
  });

  it('should report false for numbers', function() {
    expect(isObject(2)).is.false();
  });

  it('should report false for strings', function() {
    expect(isObject('a string')).is.false();
  });

  it('should report false for booleans', function() {
    expect(isObject(true)).is.false();
  });
});
