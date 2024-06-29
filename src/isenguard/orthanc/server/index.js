/**
 * server/index.js
 */

/**
 * server index
 */
function server(options) {
  /**
   * Module initialization
   */
  this.addAsync("init:server", require("./init")(options));

  /**
   * Decorators
   */
  this.decorate("app", require("./decorators/app")(options));
  this.decorate("factory", require("./decorators/factory"));
  this.decorate("endpoint", require("./decorators/endpoint"));
  this.decorate("expressify", require("./decorators/expressify"));
}

module.exports = server;
