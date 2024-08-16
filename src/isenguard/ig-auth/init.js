/**
 * init.js
 */
const _ = require("lodash");

module.exports = (options) =>
  /**
   * Init function
   */
  async function init() {
    /* Do nothing */
    this.set("auth.vcode$", {
      verify: require("./private/vcode/verify"),
      generate: require("./private/vcode/generate"),
    });
    this.set("auth.email$", {
      verify: require("./private/email/verify"),
      generate: require("./private/email/generate"),
    });
  };
