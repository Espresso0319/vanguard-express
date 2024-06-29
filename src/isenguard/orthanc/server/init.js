/**
 * server/init.js
 */

module.exports = (options) =>
  /* Server factories Initialization */
  async function init() {
    /* Create empty array for server functions */
    this.set("server.factories", []);
  };
