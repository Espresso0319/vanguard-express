/**
 * sentry/message.js
 */
/* eslint no-console: 0, consistent-return: 0 */
const prepare = require("../private/prepare");
const _ = require("lodash");

/**
 * message handler
 */
function captureMessage(message, data = {}) {
  /* Get sentry client */
  const raven = this.get("sentry.client");

  /* skip to create error log and sentry if ignore is true */
  if (_.find(data.extra, ["details.ignore", true])) {
    return message;
  }

  /* skip to send sentry if skipSentry is true */
  if (_.find(data.extra, ["details.skipSentry", true])) {
    /* record error log to db */
    this.actAsync("ns:error,role:data,cmd:create", { message, info: data });

    return message;
  }

  /* Capture message  */
  try {
    return raven.captureMessage(message, prepare(data));
  } catch (x) {
    /* istanbul ignore next */
    (function () {
      /* Console log error */
      console.error(message);
      console.error(x.stack);
    })();
  }
}

module.exports = captureMessage;
