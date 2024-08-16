/**
 * auth/private/vcode/verify.js
 *
 */
const OhShit = require("oh-shit");
const _ = require("lodash");

/**
 * Verifies a account's vcode
 * @param {*} account
 * @param {*} vcode
 * @param {*} type - account or customer
 * @param {*} appleId
 */
async function verify(account, vcode, type, appleId) {
  /* Deny if account record has no vcode */
  if (!account.auth) {
    throw OhShit("auth-failed", {
      cause: OhShit("bad-password", { id: account._id }),
      skipSentry: true,
    });
  }

  /* Deny if account vcode too old */
  const dt = (Date.now() - account.auth.timestamp.getTime()) / 1000;

  /* Check date with expiration */
  if (dt > this.get("auth.options.vcode.expiration")) {
    throw OhShit("auth-failed", {
      cause: OhShit("expired", { id: account._id }),
      skipSentry: true,
    });
  }

  /* Deny if vcode is not the same */
  if (!account.auth.vcode.includes(vcode.slice(1))) {
    throw OhShit("auth-failed", {
      cause: OhShit("bad-password", { id: account._id }),
      skipSentry: true,
    });
  }

  /* All green, sign the token */
  const data = { $set: { "auth.count": 0, verified: true } };

  /* Save apple id for user first sign in with apple */
  if (!_.isEmpty(appleId)) {
    _.set(data, "$set.appleId", appleId);
  }

  /* Update account data */
  await this.actAsync(`ns:${type},role:data,cmd:update`, {
    id: account._id,
    data,
  });

  const str = type === "customer" ? "customer" : "staff";

  return this.actAsync(`ns:security,role:token,cmd:sign,type:${str}`, account);
}

module.exports = verify;
