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

  /* Attach UID management */
  root.decorate("uid", require("./util/uid"));

  /* Math util functions */
  root.decorate("math", require("./util/math"));

  /* i18n util functions */
  root.decorate("i18n", require("./util/i18n"));

  /* Initialize the HTTP server */
  root.use(require("./server"), core.server);

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
