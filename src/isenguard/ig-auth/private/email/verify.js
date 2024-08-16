/**
 * auth/private/vcode/verify.js
 *
 */
const OhShit = require("oh-shit");
const _ = require("lodash");
const Moment = require("moment");

/**
 * Verifies a account's vcode
 * @param {*} account
 * @param {*} vcode
 * @param {*} type - account or customer
 * @param {*} appleId
 */
async function verify(account, vcode) {
  /* Deny if account record has no vcode */
  if (!_.get(account, "email.auth")) {
    throw OhShit("auth-failed", {
      cause: OhShit("bad-password", { id: account._id }),
      skipSentry: true,
    });
  }

  /* Deny if account vcode too old */
  const dt = (Date.now() - account.email.auth.timestamp.getTime()) / 1000;

  /* Check date with expiration */
  if (dt > this.get("auth.options.vcode.expiration")) {
    throw OhShit("auth-failed", {
      cause: OhShit("expired", { id: account._id }),
      skipSentry: true,
    });
  }

  /* Deny if vcode is not the same */
  if (!account.email.auth.vcode.includes(vcode.slice(1))) {
    throw OhShit("auth-failed", {
      cause: OhShit("bad-password", { id: account._id }),
      skipSentry: true,
    });
  }

  /* All green, add email */
  const data = {
    $set: {
      "email.auth.count": 0,
      "email.address": _.get(account, "email.pending"),
    },
  };

  /* Reward with coupon */
  if (!_.get(account, "email.address")) {
    /* Create coupon */
    await this.actAsync("ns:coupon,role:data,cmd:create", {
      data: {
        amount: 100,
        remaining: 1,
        rebate: 0,
        recommend: true,
        condition: { customer: account._id.toString() },
        expiresAt: Moment().add(1, "week").toDate(),
        reason: "add-email",
      },
    });
  }

  /* Update account data */
  return await this.actAsync("ns:customer,role:data,cmd:update", {
    id: account._id,
    data,
  });
}

module.exports = verify;
