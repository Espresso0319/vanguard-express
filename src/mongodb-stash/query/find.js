/**
 * find.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const _            = require('lodash');
const ObjectID     = require('../objectid');


/**
 * Finds a document by its ID, utilizing cache if possible.
 *
 * @param     {ObjectID}     ID of the document to search for.
 * @return    {object}       Document with the ID.
 */
async function byId(id) {

  let cached = null;

  try {
    cached = await this.cache.get(id);
  } catch (error) {

    console.log(error);
  }

  if (cached) {
    return cached;
  }

  const query = { _id: ObjectID(id) };
  const result = await this.collection.findOne(query);

  this.cache.set(result);

  return result;

}


/**
 * Find multiple documents.
 * MongoStash does not cache by query.
 *
 * @param     {object}       MongoDB query.
 * @param     {object}       MongoDB projection.
 * @return    {array}        The array of matching documents.
 */
async function list(query, projection) {
  query = query || { };

  if (!_.isEmpty(this.projection)) {
    projection = _.merge({ }, this.projection, projection);
  }

  const result = await this.collection.find(query, projection).toArray();
  return result;
}


/**
 * Find one document.
 * MongoStash does not cache by query.
 *
 * @param     {object}       MongoDB query.
 * @param     {object}       MongoDB projection.
 * @return    {object}       The matching document.
 */
async function one(query, projection) {
  query = query || { };

  if (!_.isEmpty(this.projection)) {
    projection = _.merge({ }, this.projection, projection);
  }

  const result = await this.collection.findOne(query, projection);
  return result;
}

/**
 * Find multiple documents count.
 * MongoStash does not cache by query.
 *
 * @param     {object}       MongoDB query.
 * @param     {object}       MongoDB projection.
 * @return    {array}        The array of matching documents.
 */
async function count(query, projection) {
  query = query || { };

  if (!_.isEmpty(this.projection)) {
    projection = _.merge({ }, this.projection, projection);
  }

  const result = await this.collection.find(query, projection).count();
  return result;
}


/**
 * Exports
 */
module.exports = { byId, list, one, count };
