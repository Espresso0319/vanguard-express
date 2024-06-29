/**
 * store/init.js
 */
const { $$store } = require("./private/symbols");

/**
 * Seneca instance patcher
 */
module.exports = (options) =>
  /**
   * Initialize Seneca instance
   */
  function init() {
    /* create store path */
    this.root[$$store] = {};
  };
