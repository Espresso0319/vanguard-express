const _ = require("lodash");
const { timeout: promiseTimeout } = require("promise-timeout");

/**
 * Export stuff
 */
module.exports = { keys };

/**
 * Get all keys
 */
async function keys(pattern) {
  let result = null;

  /* Get Keys */
  try {
    const arr = await promiseTimeout(
      this.get("redis").keysAsync(pattern),
      Number(this.get("redisTimeout")) * 3
    );

    /* Remove all collection name from Redis key */
    result = _.map(arr, (key) => _.replace(key, /^([a-z])\w+_/i, ""));
  } catch (error) {
    throw error;
  }

  return result;
}
