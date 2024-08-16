/**
 * api/auth/index.js
 */

require("schematik").use(require("@riceeu/schema"));

/**
 * Auth package
 */
function auth(options) {
  /* set auth options */
  this.set("auth.options", options);

  /* Initialize package */
  this.addAsync("init:auth", require("./init")(options));
}

module.exports = auth;
module.exports.web = require("./web");
module.exports.VERSION = require("../package.json").version;
