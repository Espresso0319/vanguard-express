/**
 * crypto/json/sign.js
 */
const _ = require("lodash");
const Crypto = require("crypto");
const Stringify = require("json-stable-stringify");

/**
 * sign crypto
 */
async function sign({ data, length = 12, domain = "" }) {
  /* Get crypto secret */
  const key = this.get("crypto.secret");
  const hmac = Crypto.createHmac("sha256", `${domain}:${key}`);

  /**
   * Get rid of the existing signature
   */
  data = _.omit(data, "sig$");

  /**
   * Stringify payload if it's an object
   */
  data = Stringify(data, { replacer });

  /**
   * Compute the hash
   */
  hmac.update(data);

  /* compute */
  const sig$ = hmac.digest("base64").substring(0, length);

  /**
   * Attach the signature to the incoming payload
   */
  return { sig$ };
}

module.exports = sign;

/**
 * Replacer function that auto-stringifies ObjectIDs
 */
function replacer(key, value) {
  /* stringifies ObjectIDs */
  if (value && value._bsontype === "ObjectID") {
    return value.toString();
  }

  return value;
}
