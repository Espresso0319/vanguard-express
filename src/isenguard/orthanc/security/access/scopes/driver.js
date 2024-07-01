/**
 * security/access/scopes/account.js
 */

/**
 *  Driver face control
 */
function driver(fc) {
  /**
   * driver_id -> account
   */
  fc.scope("account", { hint: "driver_id" }, async (req) =>
    /* Find account */
    this.actAsync("ns:account,role:data,cmd:find", { id: req.params.driver_id })
  );
}

module.exports = driver;
