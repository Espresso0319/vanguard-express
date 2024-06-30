/**
 * crypto/index.js
 */

/**
 * crypto action index
 */
function crypto(options) {
  /**
   * Initialization
   */
  this.addAsync("init:crypto", require("./init")(options));

  /**
   * Actions
   */
  this.addAsync("ns:crypto,role:jwt,cmd:sign", require("./actions/jwt/sign"));
  this.addAsync(
    "ns:crypto,role:jwt,cmd:verify",
    require("./actions/jwt/verify")
  );
  this.addAsync("ns:crypto,role:json,cmd:sign", require("./actions/json/sign"));
}

module.exports = crypto;
