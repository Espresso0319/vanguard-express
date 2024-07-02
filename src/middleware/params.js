/**
 * middleware/params.js
 * @desc    Converts parameters into BSON ObjectIDs.
 */
const OhShit = require("oh-shit");
const Mongo64 = require("base64-mongo-id");

/**
 * ID fields to check.
 */
const fields = [
  "food_id",
  "rest_id",
  "role_id",
  "issue_id",
  "order_id",
  "region_id",
  "ticket_id",
  "account_id",
  "driver_id",
  "category_id",
  "customer_id",

  /* riya */
  "meal_id",
  "stop_id",
  "route_id",
];

/**
 * Checks ID parameters in URL for validity, then converts
 * them into BSON ObjectIDs.
 */
function _params(req, res, next) {
  const p = req.params;

  /* iterate keys */
  for (const key of fields) {
    /**
     * If there is no such attribute, skip
     */
    if (!p[key]) {
      continue;
    }

    /**
     * If it is a 16 character base64 decodable string, decode it
     * before : [\w-]
     * \w:[[A-Za-z0-9]]
     * plus:-
     */

    if (/^[A-Za-z0-9-]{16}$/.test(p[key])) {
      p[key] = Mongo64.toHex(p[key]);
    }

    /**
     * If it is a valid ObjectId string, convert it to BSON
     */
    try {
      p[key] = this.uid.canon(p[key]);
    } catch (err) {
      return next(OhShit("invalid-id", { key, value: p[key] }));
    }
  }

  return next();
}

/**
 * Middleware factory function
 */
function params(options) {
  /* Always insert unless explicitly disabled */
  if (options.params === false) {
    return null;
  }

  return _params.bind(this);
}

module.exports = params;
module.exports.params = _params;
