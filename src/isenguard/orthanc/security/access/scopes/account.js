/**
 * security/access/scopes/account.js
 */

/**
 *  Account face control
 */
function account(fc) {
  /**
   * account_id -> account
   */
  fc.scope("account", { hint: "account_id" }, async (req) =>
    /* Find account */
    this.actAsync("ns:account,role:data,cmd:find", {
      id: req.params.account_id,
    })
  );
}

module.exports = account;
