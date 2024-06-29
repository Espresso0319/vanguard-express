/**
 * index.js
 */
const Seneca = require("seneca");

/**
 * This function creates a new Orthanc instance and attaches all core
 * services to it.
 */
function new$(options) {
  /* Here is the core seneca instance that we will be extending */
  const root = Seneca(options.core.seneca);
  const core = options.core;

  /* Async extensions */
  root.use("seneca-as-promised");

  /* Ephemeral data storage */
  root.use(require("./store"));

  return root;
}

/**
 * Singleton instance
 */
let singleton = null;

/**
 * Singleton constructor
 */
module.exports = (options) => {
  if (!singleton) {
    singleton = new$(options);
  }

  return singleton;
};

module.exports.new$ = new$;
