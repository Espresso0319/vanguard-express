/* -------------------------------------------------------------------------- */
/*                                                                            */
/* Middleware for handling errors.                                            */
/*                                                                            */
/* -------------------------------------------------------------------------- */
const _ = require("lodash");
const Hafiz = require("hafiz");
const OhShit = require("oh-shit");
const Seneca = require("../isenguard/orthanc")();

/**
 * Error handler middleware
 */
function _error(err, req, res, next) {
  // eslint-disable-line

  /* Peel eraro to get the inner error */
  while (err.eraro && err.orig) {
    err = err.orig;
  }

  /* Wrap VanguardErrors */
  if (err.name === "VanguardError") {
    err = OhShit("legacy-error", {
      status: err.status,
      message: err.message,
      cause: err,
    });
  }

  /* Action permission denied error */
  if (err.name === "UnauthorizedError" || err.name === "AuthorizationError") {
    err = OhShit("access-denied", { cause: err, skipSentry: true });
  }

  /* Wrap validation errors */
  if (err.name === "JsonSchemaValidation") {
    err = OhShit(400, { errors: err.validations });
  }

  /* MongoDB error */
  if (err.name === "MongoError" && err.code === 11000) {
    err = OhShit("duplicate-entry", { cause: err });
  }

  /* Kapow errors, sensitive by default */
  if (err.httpStatus) {
    /* Create the capture payload and send to sentry */
    Seneca.captureMessage(err.message, {
      request: req,
      extra: err.data.details,
      tags: err.data.tags,
      user: req.user,
    });

    /* Only reveal error details if explicitly specified */
    const sensitive = _.get(err, "data.tags.sensitive") !== false;
    const payload = {
      error: sensitive ? err.title : err.message,
      code: err.data.details.code,
    };

    /* assign error if details is defined */
    if (!sensitive || Hafiz.env(/dev/)) {
      _.assign(payload, err.data);
    }

    /* Send response */
    res.status(err.httpStatus).send(payload);

    return;
  } else if (err.ohshit) {
    /* Capture the error and send to sentry */
    const summary = OhShit.inflate(err).summary(true);

    /* capture error */
    Seneca.captureMessage(summary.message, {
      user: req.user,
      request: req,
      extra: summary.causes,
    });

    /* Only reveal top-level error */
    const response = _.pick(err.summary(), "code", "message", "details");

    /* Copy over message to error */
    response.error = response.message;

    res.status(err.status).send(response);

    return;
  }

  /**
   * By this point, we are sure this is an unexpected error.
   * Mark it as urgent, capture it, then send standard 500 response to client.
   */
  console.error(err);
  console.error(err.stack);
  Seneca.captureError(err, {
    request: req,
    tags: { urgent: true, expected: false },
    user: req.user,
  });
  res.status(500).send({ error: "Internal Server Error" });
}

/**
 * Factory function
 */
function error() {
  return _error;
}

/**
 * Export factory and middleware
 */
module.exports = error;
module.exports.middleware = _error;
