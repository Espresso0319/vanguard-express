/**
 * store/index.js
 */

/**
 * store index
 */
function store(options) {
  /**
   * Module initialization
   */
  this.addAsync("init:store", require("./init")(options));

  /**
   * Decorators
   */
  this.decorate("get", require("./decorators/get"));
  this.decorate("set", require("./decorators/set"));
}

module.exports = store;
