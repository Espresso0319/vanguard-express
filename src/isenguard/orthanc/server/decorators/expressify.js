/**
 * server/decorators/expressify.js
 */
const _ = require("lodash");
const Debug = require("debug")("ig:core:server");
const Bluebird = require("bluebird");

/**
 * express decorator
 */
function expressify(pattern, options = {}) {
  /* Default Express status 200 */
  _.defaults(options, { status: 200 });

  return (req, res, next) => {
    /* */
    const self = this.root.delegate({ user$: req.user, ua$: req.ua });

    /* Display method and path in log */
    Debug(req.method, req.path);

    /* Create Promise for methods */
    const promise =
      typeof pattern === "function"
        ? Bluebird.try(() => pattern.call(self, req, res))
        : self.actAsync(pattern, req);

    /* after action executed */
    promise
      .then((data) => {
        /* Do not respond if handler already did */
        if (res.headersSent) {
          return;
        }

        /**
         * @deprecated
         * Send raw data instead of object.
         * Use res.send() in the handler instead.
         */
        if (data && data.$$raw) {
          data = data.$$raw;
        }

        /**
         * If data includes an updatedAt timestamp, include it as the Last-Modified header
         */
        if (data && data.updatedAt instanceof Date) {
          res.set("Last-Modified", data.updatedAt.toUTCString());
        }

        /**
         * Send the resulting JSON object to the client
         */
        res.status(options.status).send(data);
      })
      .catch(next);
  };
}

module.exports = expressify;
