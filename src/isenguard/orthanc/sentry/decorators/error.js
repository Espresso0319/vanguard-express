/**
 * sentry/error.js
 */
/* eslint no-console: 0, consistent-return: 0 */
const prepare = require("../private/prepare");
const _ = require("lodash");

/**
 * sentry error handler
 */
function captureError(error, data = {}) {
  /* Get sentry client */
  const raven = this.get("sentry.client");

  /* skip to send sentry if skipSentry is true */
  if (data.skipSentry) {
    /* record error log to db */
    this.actAsync("ns:error,role:data,cmd:create", {
      message: _.get(error, "message", error),
      error,
      detail: _.omit(data, "skipSentry"),
    });

    return error;
  }

  /* Capture error */
  try {
    return raven.captureError(error, prepare(data));
  } catch (x) {
    /* istanbul ignore next */
    (function () {
      /* console log Error */
      console.error(error.stack);
      console.error(x.stack);
    })();
  }
}

module.exports = captureError;
