/**
 * store/get.js
 */
const _ = require("lodash");
const { $$store } = require("../private/symbols");

/**
 * get store decorator
 */
function get(path, def = null) {
  return _.get(this.root[$$store], path) || def;
}

module.exports = get;
