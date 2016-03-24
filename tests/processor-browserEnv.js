'use strict';
var expect = require('assume');
var BrowserProcessor = require('../processors/browserEnv');

describe('Browser Env Processor', function () {
  it('should add browser environment to error object', function () {
    var browserProcessor = new BrowserProcessor();
    var errInfo = {
      error: true
    };

    expect(browserProcessor.process(errInfo)).is.not.false();

    expect(errInfo.environment).is.an('object');
    expect(errInfo.environment.url).is.a('string');
    expect(errInfo.environment.cookies).is.a('string');
    expect(errInfo.environment.headers).is.an('object');
    expect(errInfo.environment.headers['User-Agent']).is.an('string');
  });
});
