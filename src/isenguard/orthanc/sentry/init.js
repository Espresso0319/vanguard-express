/**
 * sentry/init.js
 */
const Raven = require("raven");
const Debug = require("debug")("orthanc:sentry:init");
const _ = require("lodash");
const { unzipSync } = require("zlib");

/* eslint no-process-env: 0 */

module.exports = (options) =>
  /**
   * Initialize Sentry
   */
  async function init() {
    /**
     * Create the Sentry client
     */
    const client = new Raven.Client(options.dsn, {
      release: options.version,
      environment: process.env.NODE_ENV,
      stackFunction: Error.prepareStackTrace,
    });

    /* bind sentry client */
    this.set("sentry.client", client);

    /**
     * If enabled, patch the global exception handler
     */
    if (client._enabled) {
      Debug("sentry enabled", options.version);
      client.patchGlobal((success, error) => {
        /* Exception handler */
        this.die(error);
      });
    }

    /**
     * Catch sentry error event
     * - record to database
     * - resend to sentry
     */
    client.on("error", async (e) => {
      /**
       * Parse the data from the sentry
       */
      const buffer = Buffer.from(e.sendMessage, "base64");
      const result = JSON.parse(unzipSync(buffer).toString());

      /**
       * Check the sending mark to avoid circular sending
       */
      const alreadyResend = _.get(result, "extra.Error.alreadyResend");

      if (alreadyResend) {
        return;
      }

      const msg = result.message;
      const message = msg.substr(0, 100);

      const err = new Error(
        `Missing error, please check the details in database, ${message}`
      );
      const data = await this.actAsync("ns:error,role:data,cmd:create", {
        message,
        info: _.pick(result, [
          "request",
          "user",
          "message",
          "exception",
          "extra",
        ]),
      });

      /**
       * Mark alreadyResend: true
       */
      this.captureError(
        _.assign(err, { errId: data._id, alreadyResend: true })
      );
    });
  };
