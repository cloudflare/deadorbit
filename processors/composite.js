'use strict';

function CompositeProcessor(processors) {
  this.processors = processors;
}

CompositeProcessor.prototype.process = function (errInfo) {
  var index = -1;
  var length = this.processors.length;

  while (++index < length) {
    if (this.processors[index].process(errInfo) === false) {
      return false;
    }
  }
};

module.exports = CompositeProcessor;
