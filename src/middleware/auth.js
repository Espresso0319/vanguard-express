/**
 * middleware/auth.js
 */
const OhShit = require("oh-shit");
const _ = require("lodash");

/**
 * Auth middleware
 */
function auth(options) {
  /* Get the instance of passport */
  const Passport = this.get("passport");

  /**
   * If not specified, authentication mechanism should be JWT/anonymous
   * The actual permission check is offloaded to the face-control
   */
  if (typeof options.auth === "undefined") {
    options.auth = options.public ? ["jwt", "anonymous"] : "jwt";
  }

  /**
   * If auth is explicitly null, false or 'none', then no auth needed
   */
  if (!options.auth || /^none$/i.test(options.auth)) {
    return null;
  }

  /**
   * Spawn a Passport.js middleware with appropriate params
   */
  return (req, res, next) => {
    Passport.authenticate(
      options.auth,
      { session: false },
      (err, user, info) => {
        /**
         * Wrap all authentication failures into auth-failed envelope
         */
        if (info) {
          err = OhShit("auth-failed", { cause: info });

          /* if accout is suspended fail with specific reason */
          if (_.get(info, "status") === 403) {
            err = OhShit("account-suspended", { cause: info });
          }

          if (_.get(info, "name") === "Bad password") {
            err = OhShit("password-unmatch", { cause: info, skipSentry: true });
          }

          /* skip if passport error with 'No auth token'  */
          if (_.get(info, "message") === "No auth token") {
            err = OhShit("no-auth-token", { skipSentry: true });
          }

          /* skipSenrty for jwt expired */
          if (_.get(info, "message") === "jwt expired") {
            err = OhShit("auth-failed", { cause: info, skipSentry: true });
          }
        }

        /**
         * Hand off all errors to global error handler
         */
        if (err) {
          return next(err);
        }

        /**
         * Set req.user and continue
         */
        req.user = user;

        return next();
      }
    )(req, res, next);
  };
}

module.exports = auth;
