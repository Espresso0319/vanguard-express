/**
 * crypto/jwt/sign.js
 */
const _ = require("lodash");
const JWT = require("jsonwebtoken");

/**
 * Verify the provided token
 */
async function verify({ token }) {
  /* Get crypto secret */
  const key = this.get("crypto.secret");

  const decoded = JWT.verify(token, key);

  return decoded;
}

module.exports = verify;
