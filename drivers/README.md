# DeadOrbit Drivers

## Builtin Drivers

### Sentry

The Sentry Driver communicates wth Sentry instances that support version 4 of the API.

The following keys are expected to be passed to the constructor:

* **project** The project ID.
* **key** The project's public key.
* **server** The root address of the Sentry installation.
* **secret** If running in NodeJS, the project's secret key.

### Debug

The Debug Driver utilizes the `debug` module for namespaced console logging in NodeJS and the browser.

The follow keys are accepted by the constructor:

* **namespace** The `debug` namespace to be used by this driver, defaults to "deadorbit.driver.debug:log".

### Composite

The Composite Driver accepts an array of driver instances, and reported errors are forwarded to each.


## Custom Drivers

Custom drivers can easily be built, and instances are expected to have a single method "report".
This method accepts a standardized error information object, which can be used to generate a payload for your backend service.