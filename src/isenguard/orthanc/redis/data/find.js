/**
 * data/token/find.js
 */
const _ = require("lodash");

/**
 * find
 */
async function find({ id }) {
  /* Get collection instance */
  const stash = this.collection("redis");

  const result = await stash.findById(id);

  return _.get(result, "value");
}

module.exports = find;
