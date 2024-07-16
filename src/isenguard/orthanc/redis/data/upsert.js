/**
 * data/token/upsert.js
 */
const _ = require("lodash");
const Moment = require("moment");

/**
 * upsert
 */
async function upsert({ id, value }) {
  const data = {};

  /* Get collection instance */
  const stash = this.collection("redis");

  const info = await stash.findById(id);

  /* Update token if exist */
  if (!_.isEmpty(info)) {
    _.set(data, "$set.updatedAt", Moment().toDate());
    _.set(data, "$set.value", value);

    return await stash.updateOne(id, data);
  }

  /* Create token if not exist */
  data._id = id;
  data.value = value;
  data.createdAt = Moment().toDate();
  data.updatedAt = Moment().toDate();

  return await stash.insertOne(data);
}

module.exports = upsert;
