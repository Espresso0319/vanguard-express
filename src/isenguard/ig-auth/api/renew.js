/**
 * api/auth/renew.js
 */
const OhShit = require("oh-shit");

/**
 * Endpoint metadata
 */
exports.path = "GET /v1/auth";
exports.handler = renew;

/**
 * Request handler function
 */
async function renew(args) {
  switch (args.user.type) {
    case "customer":
      return this.actAsync(
        "ns:security,role:token,cmd:sign,type:customer",
        args.user
      );
    case "staff":
      return this.actAsync(
        "ns:security,role:token,cmd:sign,type:staff",
        args.user
      );
    case "device":
      return this.actAsync("ns:security,role:token,cmd:sign,type:device");
    default:
      throw OhShit("auth-failed", {
        cause: OhShit("unknown-type", { type: args.user.type }),
        skipSentry: true,
      });
  }
}
