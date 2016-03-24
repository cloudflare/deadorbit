'use strict';
var expect = require('assume');
var toISOString = require('../lib/toISOString');

describe('toISOString', function () {
  it('should convert a Date instance to an ISO string', function () {
    // Time zones suck, use `Date.UTC` to ensure we're always talking
    // about the same point in time.
    var date = new Date(Date.UTC(2015, 0, 1, 0, 0, 0, 0));
    expect(toISOString(date)).equals('2015-01-01T00:00:00.000Z');
  });

  it('should convert a Date instance with nanoseconds to an ISO string', function () {
    var date = new Date(Date.UTC(2015, 0, 1, 0, 0, 0, 750));
    expect(toISOString(date)).equals('2015-01-01T00:00:00.750Z');
  });
});
