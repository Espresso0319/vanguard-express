/**
 * security/auth/anonymous.js
 */
const Anonymous = require("passport-anonymous");

/**
 * Seneca plugin to put everything together.
 */
function anonymous() {
  /* Get the instance of passport */
  const Passport = this.get("passport");

  /* Create Passport.js strategy */
  const strategy = new Anonymous.Strategy();

  /* Use strategy */
  Passport.use(strategy);
}

module.exports = anonymous;
