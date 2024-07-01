/**
 * security/token/customer.js
 */
const _ = require("lodash");

/**
 * Fields to pick when creating response
 */
const fields = ["_id", "phone", "reward"];

/**
 * Customer token
 */
async function customer(args) {
  /* Get customer token from security */
  const options = this.get("security.options.customer.token");

  /* Sign JWT  */
  const _id = args._id.toString();
  const signed = await this.actAsync("ns:crypto,role:jwt,cmd:sign", {
    payload: { phone: args.phone },
    subject: _id,
    expiresIn: options.expiration,
    type: "customer",
  });

  /* Get result */
  const result = _.pick(args, ...fields);

  /* Assign token to result */
  result.token = signed.token;

  return result;
}

module.exports = customer;
