/**
 * security/token/staff.js
 */
const _ = require("lodash");

/**
 * Account fields to pick when generating response
 */
const fields = [
  "_id",
  "email",
  "roles",
  "createdAt",
  "commission",
  "onCall",
  "phone",
  "stripe.id",
  "stripe.scope",
  "stripe.onboarding",
  "stripe.status",
  "details",
  "ncns",
  "lateDrop",
  "level",
  "profile",
  "language",
  "approvedBy",
  "excludedBatch",
];

/**
 * Staff token
 */
async function staff(args) {
  /* Get security token */
  const options = this.get("security.options.token");

  /* Copy basic information into payload */
  const payload = {
    _id: args._id.toString(),
    email: args.email,
    phone: args.phone,
  };

  /* Copy roles, removing role IDs */
  payload.roles = args.roles.map((i) => _.omit(i, "_id"));

  /* Sign JWT to staff */
  const signed = await this.actAsync("ns:crypto,role:jwt,cmd:sign", {
    payload,
    subject: payload._id,
    type: "staff",
    expiresIn: options.expiration,
  });

  const result = _.pick(args, ...fields);

  /* Assign token */
  result.token = signed.token;

  return result;
}

module.exports = staff;
