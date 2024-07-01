/**
 * security/init.js
 */

/**
 * Security Initialization
 */
async function init(options) {
  /* bind root */
  const root = this.root;

  /* bind security */
  require("./access/roles").call(root, this.access, options);

  require("./access/scopes/ricepo").call(root, this.access);
  require("./access/scopes/account").call(root, this.access);
  require("./access/scopes/customer").call(root, this.access);
  require("./access/scopes/restaurant").call(root, this.access);
  require("./access/scopes/region").call(root, this.access);
  require("./access/scopes/order").call(root, this.access);
  require("./access/scopes/ticket").call(root, this.access);
  require("./access/scopes/driver").call(root, this.access);

  require("./access/actions").call(root, this.access, options);
}

module.exports = init;
