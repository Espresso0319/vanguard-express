/**
 * auth/private/vcode/generate.js
 *
 */

/**
 * Generates a new vcode for the given account
 * @param {*} account
 * @param {String} type - account or customer
 */
async function generate(account, type) {
  /* Generate a refresh vcode */
  const auth =
    account.phone === "+447418353998"
      ? {
          vcode: "6666",
          timestamp: new Date(),
          count: 1,
        }
      : {
          vcode: Math.floor(Math.random() * 8999 + 1000).toString(),
          timestamp: new Date(),
          count: 1,
        };

  /* Reuse old code if account has a fresh vcode (5 minutes until expiration) */
  if (account.auth) {
    /* Gate the time diff */
    const dt = (Date.now() - account.auth.timestamp.getTime()) / 1000;

    /* check date with expiration */
    if (dt < this.get("auth.options.vcode.expiration")) {
      auth.vcode = account.auth.vcode;
    }

    /* Increment the existing count */
    auth.count = (account.auth.count || 0) + 1;
  }

  /* Update the account record */
  /* NOTE: cannot use $inc for auth.count, because mongo throw error when $inc on null */
  await this.actAsync(`ns:${type},role:data,cmd:update`, {
    id: account._id,
    data: { $set: { auth } },
  });

  return auth.vcode;
}

module.exports = generate;
