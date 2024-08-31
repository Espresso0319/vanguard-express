/**
 * api/auth/login.js
 */
const OhShit = require("oh-shit");

/**
 * Endpoint metadata
 */
exports.path = "POST /v1/auth";
exports.auth = "local";
exports.handler = login;
exports.limit = { max: 5 };

/**
 * Request handler function
 */
async function login(req) {
  /* Get user from request */
  const { user } = req;
  const scope = { account: user._id };

  /* Deny if user is unverified */
  if (!user.verified) {
    this.actAsync("ns:event,cmd:create", {
      req,
      scope,
      name: "auth.login_failure",
    });

    throw OhShit("account-unverified", {
      cause: OhShit("account-unverified", { email: user.email }),
    });
  }

  /* If user has no roles */
  if (user.roles.length === 0) {
    this.actAsync("ns:event,cmd:create", {
      req,
      scope,
      name: "auth.login_failure",
    });

    throw OhShit("account-no-role", {
      cause: OhShit("account-no-role", { email: user.email }),
    });
  }

  /* Deny suspended users */
  if (user.suspended) {
    this.actAsync("ns:event,cmd:create", {
      req,
      scope,
      name: "auth.login_failure",
    });

    throw OhShit("auth-failed", {
      cause: OhShit("account-suspended", { email: user.email }),
      skipSentry: true,
    });
  }

  return this.actAsync("ns:security,role:token,cmd:sign,type:staff", user);
}
