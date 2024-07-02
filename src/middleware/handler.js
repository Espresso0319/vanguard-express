/**
 * middleware/handler.js
 */

/**
 * handler middleware
 */
function handler(options) {
  if (!options.handler) {
    throw new Error("Every endpoint must have a handler");
  }

  return this.expressify(options.handler, options);
}

module.exports = handler;
