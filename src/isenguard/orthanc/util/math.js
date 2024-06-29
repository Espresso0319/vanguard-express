/**
 * util/math.js
 */
const percentile = require("percentile");
const _ = require("lodash");

/**
 * Export stuff
 */
module.exports = {
  getMeanStdInPercentile,
  standardDeviation,
};

/**
 *
 * @param {Array} items data items
 * @param {Number} lowerBound
 * @param {Number} upperBound
 *
 */
function getMeanStdInPercentile({ lowerBound, upperBound, items }) {
  try {
    const [min, max] = percentile([lowerBound, upperBound], items);

    const array = _.filter(items, (item) => item >= min && item <= max);
    const avg = _.round(_.mean(array), 2);
    const std = _.round(standardDeviation(array), 2);

    return { avg, std };
  } catch (err) {
    return null;
  }
}

/**
 * Calculate the standard deviation of an array
 * @param {Object} array
 */
function standardDeviation(array) {
  const avg = _.mean(array);

  return Math.sqrt(_.mean(_.map(array, (i) => Math.pow(i - avg, 2))));
}
