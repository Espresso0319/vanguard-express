/**
 * server/decorators/app.js
 */
const Express = require("express");
const BodyParser = require("body-parser");

module.exports = (options) => {
  /**
   * Create the express application
   */
  const app = Express();

  /**
   * Attach CORS headers
   */
  app.use(require("cors")(options.cors));

  /**
   * Attach body parser
   */
  app.use(BodyParser.json());
  app.use(BodyParser.urlencoded({ extended: true }));

  /**
   * Attach server version header to all responses
   */
  /* istanbul ignore next */
  app.use((req, res, next) => {
    /* Attached server version */
    res.setHeader("X-Powered-By", options.version);
    next();
  });

  return app;
};
