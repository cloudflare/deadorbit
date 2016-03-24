'use strict';

function BrowserProcessor() {
}

BrowserProcessor.prototype.process = function (errInfo) {
  errInfo.environment = {
    url: global.location.href,
    headers: {
      'User-Agent': global.navigator.userAgent
    },
    cookies: global.document.cookie
  };
};

module.exports = BrowserProcessor;
