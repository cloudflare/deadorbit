'use strict';
var expect = require('assume');
var xhr = require('../lib/xhr');

describe('xhr', function() {
  /*
   * This is left generic, since `httpplease` has it's own tests,
   * and because refactoring strategies is on the list to be
   * improved.
   */
  it('it should return a function', function() {
    expect(xhr).is.a('function');
  });
});
