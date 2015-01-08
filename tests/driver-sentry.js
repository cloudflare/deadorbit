'use strict';

var sinon = require('sinon');

// TODO (terin): Network strategies need to be refactored out so they can be replaced.
// This is a hack to ensure `httpplease` in within SentryDriver gets the Sinon XHR.
var requests = [];
var xhr = sinon.useFakeXMLHttpRequest();
xhr.onCreate = function(request) {
  requests.push(request);
};

var expect = require('assume');
var SentryDriver = require('../drivers/sentry');

describe('Sentry Driver', function() {
  afterEach(function() {
    requests = [];
  });

  after(function() {
    xhr.restore();
  });

  it('should compute the API endpoint correctly', function() {
    var sentryDriver = new SentryDriver({
      server: 'http://sentry.example.com',
      project: '25',
      key: 'abcdef'
    });

    expect(sentryDriver.server).equals('http://sentry.example.com/api/25/store/');
  });

  it('should compute a valid authorization header', function() {
    var sentryDriver = new SentryDriver({
      server: 'http://sentry.example.com',
      project: '25',
      key: 'abcdef'
    });
    var date = new Date(Date.UTC(2015, 0, 1, 0, 0, 0, 0));

    expect(sentryDriver.getAuthHeader(date)).equals('Sentry sentry_version=4, sentry_timestamp=1420070400000, sentry_key=abcdef, sentry_client=deadorbit/1.0.0');
  });

  it('should computer a vald authorization header with secret', function() {
    var sentryDriver = new SentryDriver({
      server: 'http://sentry.example.com',
      project: '25',
      key: 'abcdef',
      secret: 'p455w0rd'
    });
    var date = new Date(Date.UTC(2015, 0, 1, 0, 0, 0, 0));

    expect(sentryDriver.getAuthHeader(date)).equals('Sentry sentry_version=4, sentry_timestamp=1420070400000, sentry_key=abcdef, sentry_client=deadorbit/1.0.0, sentry_secret=p455w0rd');
  });

  it('should report the error to the Sentry server', function() {
    var sentryDriver = new SentryDriver({
      server: 'http://sentry.example.com',
      project: '25',
      key: 'abcdef'
    });

    sentryDriver.report({
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

    expect(requests).has.size(1);
    expect(requests[0].url).equals(sentryDriver.server);
    expect(requests[0].method).equals('POST');

    var body = JSON.parse(requests[0].requestBody);
    var date = new Date(body.timestamp);

    expect(body.culprit).equals('decodeEngram');
    expect(body.level).equals('error');
    expect(body.logger).equals('deadorbit');
    expect(body.message).equals('Engram is an Ascendant Energy at 34');
    expect(body.platform).equals('javascript');
    expect(body.project).equals('25');
    expect(body.timestamp).equals(date.toJSON());
    expect(body.exception).is.an('object');
    expect(body.exception.message).equals('Engram is an Ascendant Energy');
    expect(body.exception.type).equals('RahoolError');
    expect(body.event_id).is.a('string');
    expect(body.stacktrace).is.an('object');
    expect(body.stacktrace.frames).has.size(2);

    expect(body.stacktrace.frames[0].colno).equals('17');
    expect(body.stacktrace.frames[0].filename).equals('cryptarch.js');
    expect(body.stacktrace.frames[0].function).equals('decode');
    expect(body.stacktrace.frames[0].in_app).is.true();
    expect(body.stacktrace.frames[0].lineno).equals('89');

    expect(body.stacktrace.frames[1].colno).equals('5');
    expect(body.stacktrace.frames[1].filename).equals('decode-engram.js');
    expect(body.stacktrace.frames[1].function).equals('decodeEngram');
    expect(body.stacktrace.frames[1].in_app).is.true();
    expect(body.stacktrace.frames[1].lineno).equals('34');

    var headers = requests[0].requestHeaders;

    expect(headers['X-Sentry-Auth']).equals(sentryDriver.getAuthHeader(date));

    var type = requests[0].requestHeaders['Content-Type'].split(';')[0];
    expect(type).equals('application/json');
  });

  it('should report the error to the Sentry server without stack info', function() {
    var sentryDriver = new SentryDriver({
      server: 'http://sentry.example.com',
      project: '25',
      key: 'abcdef'
    });

    sentryDriver.report({
      message: 'Engram is an Ascendant Energy',
      type: 'RahoolError',
      stacks: [{}]
    });

    expect(requests).has.size(1);
    expect(requests[0].url).equals(sentryDriver.server);
    expect(requests[0].method).equals('POST');

    var body = JSON.parse(requests[0].requestBody);
    var date = new Date(body.timestamp);

    expect(body.culprit).not.exists();
    expect(body.level).equals('error');
    expect(body.logger).equals('deadorbit');
    expect(body.message).equals('Engram is an Ascendant Energy');
    expect(body.platform).equals('javascript');
    expect(body.project).equals('25');
    expect(body.timestamp).equals(date.toJSON());
    expect(body.exception).is.an('object');
    expect(body.exception.message).equals('Engram is an Ascendant Energy');
    expect(body.exception.type).equals('RahoolError');
    expect(body.event_id).is.a('string');
    expect(body.stacktrace).is.an('object');
    expect(body.stacktrace.frames).has.size(1);

    expect(body.stacktrace.frames[0].colno).not.exists();
    expect(body.stacktrace.frames[0].filename).not.exists();
    expect(body.stacktrace.frames[0].function).not.exists();
    expect(body.stacktrace.frames[0].in_app).is.true();
    expect(body.stacktrace.frames[0].lineno).not.exists();

    var headers = requests[0].requestHeaders;

    expect(headers['X-Sentry-Auth']).equals(sentryDriver.getAuthHeader(date));

    var type = requests[0].requestHeaders['Content-Type'].split(';')[0];
    expect(type).equals('application/json');
  });

  it('should report the error to the Sentry server with args', function() {
    var sentryDriver = new SentryDriver({
      server: 'http://sentry.example.com',
      project: '25',
      key: 'abcdef'
    });

    sentryDriver.report({
      message: 'Engram is an Ascendant Energy',
      type: 'RahoolError',
      stacks: [{
        functionName: 'decodeEngram',
        fileName: 'decode-engram.js',
        lineNumber: '34',
        columnNumber: '5',
        args: ['decoherent']
        }, {
        functionName: 'decode',
        fileName: 'cryptarch.js',
        lineNumber: '89',
        columnNumber: '17',
        args: ['decoherent']
      }]
    });

    expect(requests).has.size(1);
    expect(requests[0].url).equals(sentryDriver.server);
    expect(requests[0].method).equals('POST');

    var body = JSON.parse(requests[0].requestBody);
    var date = new Date(body.timestamp);

    expect(body.culprit).equals('decodeEngram');
    expect(body.level).equals('error');
    expect(body.logger).equals('deadorbit');
    expect(body.message).equals('Engram is an Ascendant Energy at 34');
    expect(body.platform).equals('javascript');
    expect(body.project).equals('25');
    expect(body.timestamp).equals(date.toJSON());
    expect(body.exception).is.an('object');
    expect(body.exception.message).equals('Engram is an Ascendant Energy');
    expect(body.exception.type).equals('RahoolError');
    expect(body.event_id).is.a('string');
    expect(body.stacktrace).is.an('object');
    expect(body.stacktrace.frames).has.size(2);

    expect(body.stacktrace.frames[0].colno).equals('17');
    expect(body.stacktrace.frames[0].filename).equals('cryptarch.js');
    expect(body.stacktrace.frames[0].function).equals('decode');
    expect(body.stacktrace.frames[0].in_app).is.true();
    expect(body.stacktrace.frames[0].lineno).equals('89');
    expect(body.stacktrace.frames[0].vars[0]).equals('decoherent');

    expect(body.stacktrace.frames[1].colno).equals('5');
    expect(body.stacktrace.frames[1].filename).equals('decode-engram.js');
    expect(body.stacktrace.frames[1].function).equals('decodeEngram');
    expect(body.stacktrace.frames[1].in_app).is.true();
    expect(body.stacktrace.frames[1].lineno).equals('34');
    expect(body.stacktrace.frames[1].vars[0]).equals('decoherent');


    var headers = requests[0].requestHeaders;

    expect(headers['X-Sentry-Auth']).equals(sentryDriver.getAuthHeader(date));

    var type = requests[0].requestHeaders['Content-Type'].split(';')[0];
    expect(type).equals('application/json');
  });

  it('should report the error to the Sentry server without stacks and error type', function() {
    var sentryDriver = new SentryDriver({
      server: 'http://sentry.example.com',
      project: '25',
      key: 'abcdef'
    });

    sentryDriver.report({
      message: 'Engram is an Ascendant Energy',
      stacks: []
    });

    expect(requests).has.size(1);
    expect(requests[0].url).equals(sentryDriver.server);
    expect(requests[0].method).equals('POST');

    var body = JSON.parse(requests[0].requestBody);
    var date = new Date(body.timestamp);

    expect(body.culprit).not.exists();
    expect(body.level).equals('error');
    expect(body.logger).equals('deadorbit');
    expect(body.message).equals('Engram is an Ascendant Energy');
    expect(body.platform).equals('javascript');
    expect(body.project).equals('25');
    expect(body.timestamp).equals(date.toJSON());
    expect(body.exception).not.exists();
    expect(body.event_id).is.a('string');
    expect(body.stacktrace).not.exists();

    var headers = requests[0].requestHeaders;

    expect(headers['X-Sentry-Auth']).equals(sentryDriver.getAuthHeader(date));

    var type = requests[0].requestHeaders['Content-Type'].split(';')[0];
    expect(type).equals('application/json');
  });

  it('should report the error to the Sentry server with user and tags info', function() {
    var sentryDriver = new SentryDriver({
      server: 'http://sentry.example.com',
      project: '25',
      key: 'abcdef'
    });

    sentryDriver.report({
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
      }],
      user: {
        id: '123456',
        email: 'guardian@bungie.net'
      },
      tags: [
        'something'
      ]
    });

    expect(requests).has.size(1);
    expect(requests[0].url).equals(sentryDriver.server);
    expect(requests[0].method).equals('POST');

    var body = JSON.parse(requests[0].requestBody);
    var date = new Date(body.timestamp);

    expect(body.culprit).equals('decodeEngram');
    expect(body.level).equals('error');
    expect(body.logger).equals('deadorbit');
    expect(body.message).equals('Engram is an Ascendant Energy at 34');
    expect(body.platform).equals('javascript');
    expect(body.project).equals('25');
    expect(body.timestamp).equals(date.toJSON());
    expect(body.exception).is.an('object');
    expect(body.exception.message).equals('Engram is an Ascendant Energy');
    expect(body.exception.type).equals('RahoolError');
    expect(body.event_id).is.a('string');
    expect(body.stacktrace).is.an('object');
    expect(body.stacktrace.frames).has.size(2);

    expect(body.stacktrace.frames[0].colno).equals('17');
    expect(body.stacktrace.frames[0].filename).equals('cryptarch.js');
    expect(body.stacktrace.frames[0].function).equals('decode');
    expect(body.stacktrace.frames[0].in_app).is.true();
    expect(body.stacktrace.frames[0].lineno).equals('89');

    expect(body.stacktrace.frames[1].colno).equals('5');
    expect(body.stacktrace.frames[1].filename).equals('decode-engram.js');
    expect(body.stacktrace.frames[1].function).equals('decodeEngram');
    expect(body.stacktrace.frames[1].in_app).is.true();
    expect(body.stacktrace.frames[1].lineno).equals('34');

    expect(body.user).is.an('object');
    expect(body.user.id).equals('123456');
    expect(body.user.email).equals('guardian@bungie.net');

    expect(body.tags).is.an('array');
    expect(body.tags).has.size(1);
    expect(body.tags[0]).equals('something');

    var headers = requests[0].requestHeaders;

    expect(headers['X-Sentry-Auth']).equals(sentryDriver.getAuthHeader(date));

    var type = requests[0].requestHeaders['Content-Type'].split(';')[0];
    expect(type).equals('application/json');
  });
});
