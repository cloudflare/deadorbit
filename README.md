# DeadOrbit
> Members of [Dead Orbit](http://destiny.wikia.com/wiki/Dead_Orbit) intend to escape the dying Earth before The Darkness returns, as they've given up on The Traveler and put little faith in The City's ability to hold out against a major attack.

Dead Orbit is a flexible JavaScript utility to log errors in NodeJS and the browser.

## Usage
An instance of DeadOrbit is configured with a [driver](drivers/) that accepts a standardized error information object and communicates with a logging service, and optionally a [processor](processors/) that can modify or reject the error.

```javascript
var DeadOrbit = require('deadorbit');
var SentryDriver = require('deadorbit/drivers/sentry');
var BrowserProcessor = require('deadorbit/processors/browserEnv');

var sentryDriver = new SentryDriver({
  server: 'https://sentry.example.com/',
  project: '25',
  key: 'abcde12345'
});
var browserProcessor = new BrowserProcessor();
var deadOrbit = new DeadOrbit(sentryDriver, browserProcessor);
```

See the [drivers](drivers/) directory for more information about the available drivers and the parameters they accept.
Likewise, see the [processors](processors/) directory for information about processors.

Errors can be reported by passing an Error instance to the "report" method.

```javascript
deadOrbit.report(new Error('Test error message'));
```

The report method also accepts an optional "options" parameter, which can contain the following keys:

* tags
* user

## Standardized Error Info
A standardized error info object is created by core Dead Orbit code, and is passed to the "process" and "report" methods of processors and drivers.

The standardized error information object can contain the following keys:

* **message** The Error's message
* **type** The Error's type
* **stacks** An array of frame objects
* **user** A user object
* **tags** An array of custom tags
* **environment** An object containing information about the current environment.

A frame object can contain the following keys:

* **fileName** The filename for this frame.
* **functionName** The function name for this frame.
* **lineNumber** The line number for this frame.
* **columnNumber** The columne number for this frame.
* **args** An array of arguments give to the function of this frame.

## Known Issues

* Drivers have a hard dependency on network communication dependencies.
  These should be injectable as well. (Milestone: 2.0.0)
* Sentry driver has poor backwards compatiblity due to the network communication dependency. (Milestone: 2.0.0)
* Airbrake driver is not yet written. (Milestone: 1.1.0)
* Project isn't called "dinklebot".
