/**
 * api/auth/device.js
 */

/**
 * Endpoint metadata
 */
exports.path = "GET /v1/device-token";
exports.auth = null;
exports.handler = device;

/**
 * Request handler function
 */
async function device() {
  return this.actAsync("ns:security,role:token,cmd:sign,type:device");
}
