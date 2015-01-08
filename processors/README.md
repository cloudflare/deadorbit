# DeadOrbit Processors

## Builtin Processors

### Browser Environment

The Browser Environment processor modifies the errInfo object by adding the "environment" field with the following keys:

* **url** The URL of the current page.
* **headers** An object containing the browser's User Agent
* **cookies** A string containing the page's non-HTTP Only cookies.

### Filter

The Filter processors will return `false` if the error message or culprit file matches ignore settings.

The following keys are accepted by the constructor:

* **ignoreErrors** Array of strings or RegExps that filter out error messages.
* **ignoreUrls** Array of strings or RegExps that filter out URLs

### Composite

The Composite processor accepts an array of processor instances, and reported errors are forwarded to each.


## Custom Processors

Custom processors can easily be built, and instances are expected to have a single method "process".
This method accepts a standardized error information object, which can be mutated.
Returning `false` stops this error from being reported to drivers.