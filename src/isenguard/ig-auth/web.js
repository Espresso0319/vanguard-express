/**
 * web.js
 */

/**
 * Main module function
 */
function web(options) {
  /* Add endpoints */
  this.endpoint(require("./api/driver"));
  this.endpoint(require("./api/device"));
  this.endpoint(require("./api/login"));
  this.endpoint(require("./api/renew"));
  this.endpoint(require("./api/revoke"));
  this.endpoint(require("./api/sign"));
}

module.exports = web;
