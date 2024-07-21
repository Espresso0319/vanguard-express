/**
 * sentry/prepare.js
 */
const _ = require("lodash");
const Parsers = require("raven/lib/parsers");

/**
 * Custom preparation function to suit Vanguard
 */
function prepare(kwargs) {
  /*
   * If data.request is provided, parse the request.
   * Make sure to remove the `env` property.
   */
  if (kwargs.request) {
    Parsers.parseRequest(kwargs.request, kwargs);
    delete kwargs.request.env;
  }

  /**
   * If data.user is provided, change _id -> id
   */
  if (kwargs.user && kwargs.user._id) {
    kwargs.user = _.omit(kwargs.user, "passwd", "stripe.keys");
    kwargs.user.id = kwargs.user._id.toString();
    delete kwargs.user._id;
  }

  return kwargs;
}

module.exports = prepare;
