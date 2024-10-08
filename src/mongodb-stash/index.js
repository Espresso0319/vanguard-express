/**
 * index.js
 */
const _ = require("lodash");
const Util = require("util");
const Stats = require("rolling-stats");
const EventEmitter = require("events").EventEmitter;

const Cache = require("./cache");
const Find = require("./query/find");
const Insert = require("./query/insert");
const Update = require("./query/update");
const Delete = require("./query/delete");

/**
 * MongoStash class.
 */
/* eslint consistent-return: 0 */
function MongoStash(collection, redis, age, slack, url) {
  if (!(this instanceof MongoStash)) {
    return new MongoStash(collection, redis, age);
  }

  this.stats = Stats.NamedStats(1111, 1000);
  this.collection = collection;
  this.collectionName = collection.collectionName;
  this.redis = redis;
  this.cache = Cache(this, age);
  this.slack = slack;
  this.url = url;

  this.defaults = Object.create(null);
  this.projection = Object.create(null);

  this.safeMode = false;
}
module.exports = MongoStash;

/*!
 * Let stash emit events
 */
Util.inherits(MongoStash, EventEmitter);

/*!
 * Attach all member functions.
 */
_.assign(MongoStash.prototype, {
  insertOne: Insert.one,
  insertMany: Insert.many,

  findById: Find.byId,
  findOne: Find.one,
  find: Find.list,
  count: Find.count,

  updateOne: Update.one,
  updateMany: Update.many,
  updateSafe: Update.safe,

  deleteOne: Delete.one,
  deleteMany: Delete.many,
  deleteSafe: Delete.safe,
  drop: Delete.drop,
});
