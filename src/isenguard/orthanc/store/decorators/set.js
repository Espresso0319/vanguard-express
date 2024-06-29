/**
 * store/set.js
 */
const _ = require("lodash");
const { $$store } = require("../private/symbols");

/**
 * set store decorator
 */
function set(path, value) {
  console.log("set--->", path);
  _.set(this.root[$$store], path, value);
}

module.exports = set;
