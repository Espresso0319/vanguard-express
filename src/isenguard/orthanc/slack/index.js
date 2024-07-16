/**
 * server/index.js
 */

/**
 * server index
 */
function slack(options) {
  /**
   * Module initialization
   */
  this.addAsync("init:slack", require("./init")(options));

  this.addAsync("ns:slack,cmd:send", require("./actions/send"));
}

module.exports = slack;
