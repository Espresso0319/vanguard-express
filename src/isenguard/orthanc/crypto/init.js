/**
 * crypto/init.js
 */

module.exports = (options) =>
  /**
   * Initialize Crypto
   */
  async function init() {
    /* Bind crypto configuration */
    this.set("crypto", options);
  };
