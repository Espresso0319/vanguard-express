/**
 * crypto/jwt/sign.js
 */
const _ = require("lodash");
const JWT = require("jsonwebtoken");

/**
 * Valid JWT config options.
 */
const validOptions = [
  "algorithm",
  "expiresIn",
  "notBefore",
  "audience",
  "subject",
  "issuer",
  "jwtid",
  "subject",
  "noTimestamp",
  "headers",
];

/**
 * Creates an auth token using the specified payload.
 */
async function sign(args) {
  /* Get crypto secret */
  const key = this.get("crypto.secret");

  /**
   * Deep clone the payload, since JWT.sign() will modify it
   */
  const payload = _.cloneDeep(args.payload || {});

  /**
   * If token is not marked permanent, assign an expiration
   */
  if (!args.permanent && !args.expiresIn) {
    throw new Error("Token requires expiration");
  }

  /**
   * Require token type
   */
  if (!args.type) {
    throw new Error("Token type is required");
  }

  /* parse token type*/
  payload.type = args.type;

  /**
   * Sign the token and return it
   */
  const opts = _.pick(args, ...validOptions);
  const token = JWT.sign(payload, key, opts);

  return { token };
}

module.exports = sign;
