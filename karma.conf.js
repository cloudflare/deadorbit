'use strict';
var customLaunchers = {};

var minimist = require('minimist');
var defined = require('defined');

var args = minimist(process.argv.slice(2), {
  string: ['env', 'build-branch', 'build-number', 'suace-username', 'sauce-key'],
  'default': {
    env: process.env.NODE_ENV,
    'build-branch': process.env.BUILD_BRANCH,
    'build-number': process.env.BUILD_NUMBER,
    'sauce-username': process.env.SAUCE_USERNAME,
    'sauce-key': process.env.SAUCE_ACCESS_KEY
  }
});

args.istanbul = defined(args.istanbul, args.env !== 'CI');
args['sauce-labs'] = defined(args['sauce-labs'], args.env === 'CI');

// Overridable arguments are denoted below. Other arguments can be found in the
// [Karma configuration](http://karma-runner.github.io/0.12/config/configuration-file.html)

['chrome', 'firefox', 'safari',
'iphone', 'ipad', 'android'].forEach(function(browser) {
  customLaunchers['sl_' + browser] = {
    base: 'SauceLabs',
    browserName: browser
  };
});

[9, 10, 11].forEach(function(version) {
  customLaunchers['sl_ie_' + version] = {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: version
  };
});

var reporters = ['mocha', 'beep'];

if (args.istanbul) {
  reporters.push('coverage');
}

module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],

    files: [
      'tests/*.js'
    ],

    preprocessors: {
      'tests/*.js': ['browserify'],
      'no/such/path': ['coverage']
    },

    // Overridable with a comma-separated list with `--reporters`
    reporters: reporters,

    // Overridable with `[--no]-colors
    colors: true,

    /* Overridable with `--log-level=<level>`.
     *
     * Possible 'level' options include:
     * 	* disable
     * 	* error
     * 	* warn
     * 	* info
     * 	* debug
     */
    logLevel: config.LOG_INFO,

    // Overridable with a comma-separated list with `--browsers`
    browsers: args['sauce-labs'] && Object.keys(customLaunchers),

    sauceLabs: {
      username: args['sauce-username'],
      accessKey: args['sauce-key'],
      testName: require('./package.json').name,
      tags: args['build-branch'],
      build: args['build-number']
    },

    browserify: {
      debug: true,
      transform: args.istanbul && [
        ['browserify-istanbul', {
          ignore: ['**/*.handlebars']
        }]
      ]
    },

    coverageReporter: {
      reporters: [
        {
          type: 'html'
        },
        {
          type: 'text'
        }
      ]
    },

    client: {
      // '--grep' arguments are passed directly to mocha.
      args: args.grep && ['--grep', args.grep],
      mocha: {
        reporter: 'html'
      },
      captureConsole: true
    },

    customLaunchers: customLaunchers
  });
};
