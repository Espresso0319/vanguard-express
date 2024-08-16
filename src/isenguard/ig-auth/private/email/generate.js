/**
 * auth/private/vcode/generate.js
 *
 */

const _ = require("lodash");

/**
 * Generates a new vcode for the given account
 * @param {*} account
 * @param {String} type - account or customer
 */
async function generate(account, emailAddress) {
  const expirationTime = this.get("auth.options.vcode.expiration") * 1000; // 将过期时间转换为毫秒
  const currentTime = Date.now();
  const { email = {} } = account;

  const auth = {
    vcode: Math.floor(Math.random() * 8999 + 1000).toString(),
    timestamp: new Date(currentTime),
    count: 1,
  };

  if (email.auth && email.pending === emailAddress) {
    const timeDiff = currentTime - new Date(email.auth.timestamp).getTime();

    if (timeDiff < expirationTime) {
      auth.vcode = email.auth.vcode;
      auth.count = email.auth.count + 1;
    }
  }

  await this.actAsync("ns:customer,role:data,cmd:update", {
    id: account._id,
    data: {
      $set: {
        "email.auth": auth,
        "email.pending": emailAddress,
      },
    },
  });

  return auth.vcode;
}

module.exports = generate;
