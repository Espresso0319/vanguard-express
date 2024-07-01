/**
 * security/auth/local.js
 */
const Local = require("passport-local");
const Bcrypt = require("bcrypt-nodejs");
const Bluebird = require("bluebird");
const OhShit = require("oh-shit");

/**
 * Checks username/password pair.
 */
async function check({ email, password }) {
  /* Find account record */
  const rec = await this.actAsync("ns:account,role:data,cmd:find", {
    email: email.toLowerCase(),
  });

  /* No such user */
  if (!rec) {
    throw OhShit("not-found", { entity: "account", email, skipSentry: true });
  }

  /* User suspended */
  if (rec.suspended) {
    throw OhShit("account-suspended", { email });
  }

  /* Check password */
  const result = await Bluebird.fromNode((done) =>
    Bcrypt.compare(password, rec.passwd, done)
  );

  /* Panic if no password */
  if (!result) {
    throw OhShit("bad-password", { email, skipSentry: true });
  }

  return rec;
}

/**
 * Seneca plugin to put everything together.
 */
function local() {
  /* Get the instance of passport */
  const Passport = this.get("passport");

  /* Attach seneca microservices */
  this.addAsync("ns:security,role:auth,type:local", check);

  /* Create Passport.js strategy */
  const params = { usernameField: "email" };
  const strategy = new Local.Strategy(params, (email, password, done) => {
    /* Check credential of user */
    this.root
      .actAsync("ns:security,role:auth,type:local", { email, password })
      .catch((err) => done(null, false, err))
      .then((user) => done(null, user));
  });

  /* Use strategy */
  Passport.use(strategy);
}

module.exports = local;
