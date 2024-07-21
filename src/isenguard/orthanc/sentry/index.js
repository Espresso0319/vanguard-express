/**
 * sentry/index.js
 */

/**
 * sentry index
 */
function sentry(options) {
  /**
   * Module initialization
   */
  this.addAsync("init:sentry", require("./init")(options));

  /**
   * Decorators
   */
  this.decorate("captureError", require("./decorators/error"));
  this.decorate("captureMessage", require("./decorators/message"));
}

module.exports = sentry;
