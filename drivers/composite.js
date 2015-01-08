'use strict';
var forEach = require('foreach');

function CompositeDriver(drivers) {
  this.drivers = drivers;
}

CompositeDriver.prototype.report = function(errInfo) {
  forEach(this.drivers, function(driver) {
    driver.report(errInfo);
  });
};

module.exports = CompositeDriver;
