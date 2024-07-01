/**
 * security/auth/jwt.js
 */
const _ = require("lodash");
const Jwt = require("passport-jwt");
const OhShit = require("oh-shit");

/**
 * Checks device tokens.
 */
async function device() {
  return { type: "device", anonymous: true };
}

/**
 * Checks customer tokens.
 */
async function customer(args) {
  /* Find customer */
  const rec = await this.actAsync("ns:customer,role:data,cmd:find", {
    id: args.sub,
  });

  /* No such customer */
  if (!rec) {
    throw OhShit("not-found", { entity: "customer", id: args.sub });
  }

  /* Customer blacklisted */
  if (rec.blacklisted) {
    throw OhShit("customer-blacklisted", {
      id: args.sub,
      skipSentry: true,
    });
  }

  /* Assign type to be customer */
  rec.type = "customer";

  return _.omit(rec, "recommendation", "tags");
}

/**
 * Checks staff tokens.
 */
async function staff(args) {
  /* Find staff */
  const rec = await this.actAsync("ns:account,role:data,cmd:find", {
    id: args.sub,
  });

  /* No such account */
  if (!rec) {
    throw OhShit("not-found", { entity: "account", id: args.sub });
  }

  /* Account suspended */
  if (rec.suspended) {
    throw OhShit("account-suspended", { id: args.sub, skipSentry: true });
  }

  /* Revocation */
  const rev = rec.lastRevocation / 1000 || 0;

  /* Panic if auth token revoked */
  if (args.iat < rev) {
    throw OhShit("auth-token-revoked", { id: args.sub, email: rec.email });
  }

  /* Assign staff type */
  rec.type = "staff";

  return rec;
}

/**
 * Seneca plugin to put everything together.
 */
function jwt(options) {
  /* Attach seneca microservices */
  this.addAsync("ns:security,role:auth,type:device", device);
  this.addAsync("ns:security,role:auth,type:customer", customer);
  this.addAsync("ns:security,role:auth,type:staff", staff);

  /* Get the instance of passport */
  const Passport = this.get("passport");

  /* Create Passport.js strategy */
  const params = {
    secretOrKey: options.secret,
    jwtFromRequest: Jwt.ExtractJwt.fromAuthHeader(),
  };

  /* Define JWT strategy */
  const strategy = new Jwt.Strategy(params, (payload, done) => {
    /* Assign payload type to Device */
    if (!payload.sub) {
      payload.type = "device";
    } // issue #24

    /* send payload */
    this.root
      .actAsync("ns:security,role:auth", payload)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  /* Strategy */
  Passport.use(strategy);
}

module.exports = jwt;
