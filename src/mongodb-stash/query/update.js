/**
 * update.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const _            = require('lodash');
const Debug        = require('debug')('mongostash:update');
const ObjectID     = require('../objectid');


/*!
 * Default update options.
 */
const defaults = { returnDocument: 'after' };


/**
 * Updates one record by ID and modifies the cache.
 *
 * @param     {ObjectID}     ID of the document to modify.
 * @param     {object}       Changes to apply to the document.
 * @return    {object}       The updated document.
 */
async function one(id, changes, options) {

  /* Cache only option that will only update cache instead of mongodb */
  if (_.get(options, 'cacheOnly')) {
    let data = await this.cache.get(id);

    /* get mongo data as backup */
    if (!data) {
      const query = { _id: ObjectID(id) };
      data = await this.collection.findOne(query);
    }

    /* If both has no data record, do nothing */
    if (data) {

      /* overwrite directly */
      this.cache.set(_.assign(data, _.get(changes, '$set')));
    }
    return null;
  }

  const query = { _id: ObjectID(id) };
  this.cache.del(id);
  options = _.assign({ }, options, defaults);

  const write = await this.collection.findOneAndUpdate(query, changes, options);
  /**
   * Use double delete + cache aside caching strategy to maintain eventual consistency
   */
  setTimeout(() => {this.cache.del(id);}, 1000);

  return write.value;
}


/**
 * Updates multiple records and removes them from cache.
 * WARNING: If you absolutely need this to be an atomic operation,
 * consider using native update() then dropping the cache instead.
 *
 * @param     {object}       MongoDB query of documents to modify.
 * @param     {object}       Changes to apply to the documents.
 * @return    {number}       Number of updated documents.
 */
async function many(query, changes, options) {

  /* Use the safe version if safeMode is on */
  if (this.safeMode) {
    return this.updateSafe(query, changes, options);
  }

  /* Set default options, fail on attempted upsert */
  options = _.assign({ }, options, defaults);
  if (options.upsert) {
    throw new Error('Upsert is only available with safe mode.');
  }

  /* Find all maching documents and record their IDs */
  let matches = await this.collection.find(query, { projection: { _id: true } }).toArray();
  matches = _.map(matches, '_id');
  if (matches.length === 0) { return 0; }

  /* Drop all of them from cache */
  this.cache.del(matches);

  /* Execute the update */
  query = { _id: { $in: matches } };
  const write = await this.collection.updateMany(query, changes, options);

  /**
   * Use double delete + cache aside caching strategy to maintain eventual consistency
   */
  setTimeout(() => {this.cache.del(matches);}, 1000);

  /* If updated document count does not match the number of IDs, data must
   * have been modified; drop entire cache just to be safe. */
  /* istanbul ignore if */
  if (write.modifiedCount !== matches.length) {
    Debug('ModifiedCount mismatch, dropping all cache just to be safe.');
    this.cache.reset();
  }

  return write.modifiedCount;
}


/**
 * Updates multiple records and drops entire cache.
 * This operation is atomic and uses only one query.
 *
 * @param     {object}       MongoDB query of documents to modify.
 * @param     {object}       Changes to apply to the documents.
 * @return    {number}       Number of updated documents.
 */
async function safe(query, changes, options) {
  options = _.assign({ }, options, defaults);

  const write = await this.collection.updateMany(query, changes, options);
  this.cache.reset();
  return write.modifiedCount;
}


/**
 * Exports
 */
module.exports = { one, many, safe };
