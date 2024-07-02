/**
 * middleware/paging.js
 */
const _ = require("lodash");
const Moment = require("moment");

/**
 *  Paging middleware
 */
function _paging(req, res, next) {
  const { query } = req;

  /**
   * Convert `from` and `to` into timestamps
   */
  if (query.from) {
    query.from = Moment(query.from).toDate();
  }

  /* convert 'to' */
  if (query.to) {
    query.to = Moment(query.to).toDate();
  } else {
    query.to = new Date();
  }

  /**
   * Limit every API call to a maximum of 100 entities returned
   */
  if (!query.limit) {
    query.limit = _.min([query.limit, 100]);
  }

  /* jump to next */
  next();
}

module.exports = (options) => (options.paging ? _paging : null);
