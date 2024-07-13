/**
 * delete.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const _            = require('lodash');
const Debug        = require('debug')('mongostash:delete');
const ObjectID     = require('../objectid');


/**
 * Deletes one document by ID, also dropping it from cache.
 *
 * @param     {ObjectID}     ID of the document to remove.
 * @returns   {boolean}      True if a document was found and deleted.
 */
async function one(id) {
  const query = { _id: ObjectID(id) };
  this.cache.del(id);

  const write = await this.collection.deleteOne(query);
  /**
   * Use double delete + cache aside caching strategy to maintain eventual consistency
   * Per isengard-864: we change our caching strategy to using cache aside + double delete
   *                   According to cache aside, we only delete after db CURD operations.
   *                   Double delete is an improved variant where we delete before CURD
   *                   then we do another cache eviction after one second to filter out
   *                   dirty data -
   *                   (cache.sets that are happening simultaneously could be
   *                   holding data from previous iterations thus incorrectly
   *                   sets those in cache)
   */
  setTimeout(() => { this.cache.del(id); }, 1000);
  return (write.deletedCount === 1);
}


/**
 * Deletes multiple documents by a query, also dropping them from cache.
 *
 * @param     {object}       MongoDB query of documents to delete.
 * @returns   {number}       Number of documents deleted.
 */
async function many(query) {

  /* Use the safe version if safeMode is on */
  if (this.safeMode) {
    return this.deleteSafe(query);
  }

  /* Find all matching documents and record their IDs */
  let matches = await this.collection.find(query, { projection: { _id: true } }).toArray();
  matches = _.map(matches, '_id');
  if (matches.length === 0) { return 0; }

  /* Drop all of them from the cache */
  this.cache.del(matches);

  /* Execute the delete */
  query = { _id: { $in: matches } };
  const write = await this.collection.deleteMany(query);

  /**
   * Use double delete + cache aside caching strategy to maintain eventual consistency
   */
  setTimeout(() => {this.cache.del(matches);}, 1000);

  /* If updated document count does not match the number of IDs, data must
   * have been modified; drop entire cache just to be safe. */
  /* istanbul ignore if */
  if (write.deletedCount !== matches.length) {
    Debug('DeletedCount mismatch, dropping all cache just to be safe.');
    this.cache.reset();
  }

  return write.deletedCount;
}


/**
 * Deletes multiple documents by a query and drops entire cache.
 * This operation is atomic and uses only one query.
 *
 * @param     {object}       MongoDB query of documents to delete.
 * @returns   {number}       Number of documents deleted.
 */
async function safe(query) {

  const write = await this.collection.deleteMany(query);
  this.cache.reset();
  return write.deletedCount;

}

/**
 * Drop collection
 */
async function drop() {

  await this.collection.drop();
}


/**
 * Exports
 */
module.exports = { one, many, safe, drop };
