/**
 * api/webHealth.js
 */

/**
 * Endpoint metadata
 */
exports.path = "GET /health/";
exports.auth = null;
exports.handler = check;

/**
 * Request handler function
 */
async function check(req, res) {
  res.status(200);

  return {};
}
