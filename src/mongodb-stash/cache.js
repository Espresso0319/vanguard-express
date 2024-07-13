/**
 * cache.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const _            = require('lodash');
const EJSON = require('mongodb-extended-json');
const { timeout: promiseTimeout } = require('promise-timeout');
const Slack = require('./utils/slack.js');
const defaults = require('./config/default');

const { channel, tagPeople } = defaults;

const REDIS_TIMEOUT = 500;


/**
 * get(1)
 */
async function get(stash, id) {

  /* Initialise result as null */
  let result = null;
  let key = '';

  try {
    /* Create key using collection name and id */
    const name = stash.collectionName;
    key = `${name}_${id.toString()}`;

    /* Get the cached value */
    result = await promiseTimeout(stash.redis.getAsync(key), REDIS_TIMEOUT);


  } catch (error) {

    await Slack.send(stash, {
      message:`Get ${key}
      client: ${_.get(stash, 'url')}
      reason: ${error.message}`,
      tagPeople, channel
    });
  } finally {
    /* parse string */
    return EJSON.parse(result);
  }

}


/**
 * set(1)
 */
async function set(stash, age, obj) {

  let key;

  try {
     /* check if object or id is null */
    if (!obj || !obj._id) { return obj; }

  /* Create key using collection name and id */
    const name = stash.collectionName;
    key = `${name}_${obj._id.toString()}`;

    const redisStr = EJSON.stringify(obj);

  /* Set cached with expiration of 60 mins */
    await promiseTimeout(stash.redis.setAsync(
      key, redisStr,
      'EX', 24 * 60 * 60), Number(REDIS_TIMEOUT) * 3);

  /* Emit cache set event */
    stash.emit('cache.set', obj._id);

  } catch (error) {
    await Slack.send(stash, {
      message:`Set ${key}
      client: ${_.get(stash, 'url')}
      reason: ${error.message}`,
      tagPeople, channel
    });
  } finally {
    return _.cloneDeep(obj);
  }

}


/**
 * del(1)
 */
async function del(stash, id) {

  let result = null;
  let key;

  try {
      /* Create key using collection name and id */
    const name = stash.collectionName;

    /* if id is array , reorganize the array */
    if (_.isArray(id)) {
      key = _.map(id, (item) => `${name}_${item.toString()}`);

    } else {
      key = `${name}_${id.toString()}`;
    }


  /* Delete the cache */
    result = await promiseTimeout(stash.redis.delAsync(key), Number(REDIS_TIMEOUT) * 3);

  /* Emit event about delete cache */
    stash.emit('cache.del', id);
  } catch (error) {
    await Slack.send(stash, {
      message:`Del ${key}
      client: ${_.get(stash, 'url')}
      reason: ${error.message}`,
      tagPeople, channel
    });
  } finally {
    return result;
  }

}


/**
 * reset(0)
 */
async function reset(stash) {

  try {
      /* Flush all cached */

    await promiseTimeout(stash.redis.flushallAsync(), Number(REDIS_TIMEOUT) * 4);

  /* Emit cache reset */
    stash.emit('cache.reset');
  } catch (error) {
    await Slack.send(stash, {
      message: `Reset Error.
      client:${_.get(stash, 'url')} reason : ${error.message}`,
      tagPeople, channel
    });
  }

}


/**
 * Default export, creates a patched LRU cache.
 */
function cache(stash, age) {

  /* Initialise redisCache */
  const redisCache = {};

  redisCache.get = _.partial(get, stash);
  redisCache.set = _.partial(set, stash, age);
  redisCache.del = _.partial(del, stash);
  redisCache.reset = _.partial(reset, stash);
  return redisCache;
}


/**
 * Export the stuff
 */
module.exports = cache;
module.exports.get = get;
module.exports.set = set;
module.exports.del = del;
module.exports.reset = reset;
