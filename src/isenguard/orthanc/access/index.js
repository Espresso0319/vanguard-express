/**
 * access/index.js
 */
const loadActions = require("./private/load-actions");

/**
 * Access Seneca Index
 */
function access(options) {
  /**
   * Decorate orthanc instance with access
   */
  this.decorate("access", require("face-control").new$());

  /**
   * Attach action loader to the access control module
   */
  this.access.load = loadActions;

  /**
   * Initialization
   */
  this.addAsync("init:access", require("./init")(options));
}

module.exports = access;
