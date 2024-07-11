/**
 * data/init.js
 */
const _ = require("lodash");
const url = require("url");
const Mongo = require("mongodb").MongoClient;
const Debug = require("debug")("orthanc:data:init");

module.exports = (options) =>
  /**
   *  Initialize mongoDB
   */
  async function init() {
    /**
     * Load parameters, skipping the CA and URI
     */
    const params = _.omit(options, "uri", "ca", "cache");

    /* display sslCA params */
    Debug(params);

    /**
     * Actually connect
     */
    const dbName = _.last(url.parse(options.uri).pathname.split("/"));

    const uri = `${options.uri}&compressors=snappy`;

    const db = await Mongo.connect(uri, {
      ...params,
      authMechanism: "SCRAM-SHA-1",
      useUnifiedTopology: true,
    });

    /* bind database */
    this.set("db", db.db(dbName));

    /* Save cache options */
    this.set("cache.data", options.cache);

    this.log.info("Successfully connected to MongoDB");
  };
