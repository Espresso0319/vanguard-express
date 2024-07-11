/**
 * data/index.js
 */

/**
 * database index
 */
function data(options) {
  /**
   * Module initialization
   */
  this.addAsync("init:data", require("./init")(options));

  this.decorate("collection", require("./decorators/collection"));
}

module.exports = data;
