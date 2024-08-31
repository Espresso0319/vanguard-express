/**
 * api/auth/index.js
 */

require("schematik").use(require("../..//schema"));

/**
 * Auth package
 */
function auth(options) {
  /* set auth options */
  this.set("auth.options", options);

  /* Initialize package */
  this.addAsync("init:auth", require("./init")(options));

  /**
   * Database access of account
   */
  this.addAsync(
    "ns:account,role:data,cmd:find",
    require("./data/account/find")
  );
  this.addAsync(
    "ns:account,role:data,cmd:update",
    require("./data/account/update")
  );
}

module.exports = auth;
module.exports.web = require("./web");
