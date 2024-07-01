/**
 * security/index.js
 */

const Passport = require("passport");

/**
 * Seneca plugin function
 */
function security(options) {
  this.set("security.options", options);
  this.set("passport", Passport);

  /**
   * Initialization
   */
  this.addAsync("init:security", require("./init").bind(this, options.access));

  /**
   *  Actions
   */
  this.addAsync(
    `ns:security,role:token,cmd:sign,type:staff`,
    require("./token/staff")
  );
  this.addAsync(
    `ns:security,role:token,cmd:sign,type:customer`,
    require("./token/customer")
  );
  this.addAsync(
    `ns:security,role:token,cmd:sign,type:device`,
    require("./token/device")
  );

  /**
   * endpoint
   */
  this.use(require("./auth/local"));
  this.use(require("./auth/jwt"), options.token);
  this.use(require("./auth/anonymous"));

  return "security";
}

module.exports = security;
