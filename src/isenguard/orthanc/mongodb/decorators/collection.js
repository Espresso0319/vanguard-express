/**
 * collection.js
 */
const _ = require("lodash");
const Stash = require("../../../../mongodb-stash");
const Debug = require("debug")("orthanc:data:collection");

/**
 * Default caching parameters
 */
const defaults = {
  maxAge: 10000,
  maxEntries: 100,
};

/**
 * Retrieves a stashed collection.
 * If `data.test$` is set, it will prepend it to the collection name.
 *
 * @param  {String} name Name of the collection whose stash to retrieve
 * @return {Object}      MongoStash instance for the given collection
 */
function collection(name) {
  /**
   * Retrieve the test ID, if it exists, append it to the name
   */
  const test$ = this.get("data.options.test$");

  /**
   * Create a stash for the collection, unless it's already there
   */
  const path = `data.stash$.${name}`;

  /* If path is empty retrieve DB instance */
  if (!this.get(path)) {
    /**
     * Retrieve the DB instance and make sure it is ready
     */
    const db = this.get("db");

    /* throw error if db is not connected */
    if (!db) {
      throw new Error("Database is not ready");
    }

    /**
     * Determine the caching strategy
     */
    const options = this.get("cache.data");
    const strategy = _.assign({}, defaults, options);

    /* display caching strategy */
    Debug(name, strategy);

    /**
     * Create the stash
     */
    const name$ = test$ ? `${name}.${test$}` : `${name}`;
    const native = this.get("db").collection(name$);

    this.set(
      path,
      new Stash(
        native,
        this.get("redis"),
        options,
        this.get("slack.client"),
        this.get("redisUrl")
      )
    );
  }

  return this.get(path);
}

module.exports = collection;
