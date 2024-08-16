/**
 * api/auth/revoke.js
 */
const OhShit = require("oh-shit");

/**
 * Endpoint metadata
 */
exports.path = "DELETE /v1/auth";
exports.handler = revoke;

/**
 * Request handler function
 */
async function revoke(req) {
  /* Get user from request */
  const { user } = req;

  /**
   * Only staff tokens can be revoked
   */
  if (user.type !== "staff") {
    throw OhShit("access-denied", {
      user: {
        id: user._id,
        type: user.type,
      },
    });
  }

  /**
   * Record the event
   */
  this.actAsync("ns:event,cmd:create", {
    user,
    req,
    name: "auth.revoke",
    scope: { account: user._id },
  });

  /**
   * Construct and execute the update
   */
  const data = { $set: { lastRevocation: new Date() } };
  const result = await this.actAsync("ns:account,role:data,cmd:update", {
    id: user._id,
    data,
  });

  return this.actAsync("ns:security,role:token,cmd:sign,type:staff", result);
}
