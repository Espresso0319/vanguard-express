/**
 * api/clockHealth.js
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
  /* Get saved timestamp from server */
  const time = await this.actAsync("ns:util,role:data,cmd:find", {
    id: "cronTimeStamp",
  });

  /* Notify error if timestamp not found */
  if (!time) {
    res.status(500);

    return {};
  }

  /* Get the diff */
  const diff = +new Date() - time;

  /* Return time stamp 500 if diff is more than 120 seconds */
  if (Math.abs(diff) > 120 * 1000) {
    res.status(500);
  } else {
    res.status(200);
  }

  return {};
}
