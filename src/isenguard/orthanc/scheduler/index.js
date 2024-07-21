/**
 * scheduler/index.js
 */

/**
 * scheduler index
 */
function scheduler() {
  this.decorate("schedule", require("./decorators/schedule"));
}

module.exports = scheduler;
