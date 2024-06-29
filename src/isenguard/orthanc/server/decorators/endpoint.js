/**
 * server/decorators/endppoint.js
 */
const _ = require("lodash");
const Debug = require("debug")("orthanc:server:api");

/**
 * endpoint decorators
 */
function endpoint(...args) {
  /* Parse endpoint arguments */
  let options = _.last(args);
  let paths = _.dropRight(args, 1);

  /**
   * Create a new delegate that is non-fatal
   */
  const self = this.root;

  /**
   * Special support for the newer export format
   */
  if (args.length === 1 && typeof args[0] === "object") {
    options = args[0];
    paths = [].concat(args[0].path);
  }

  /* Map factories into a compact middleware stack */
  const stack = _.chain(self.get("server.factories"))
    .map((f) => f.call(self, options))
    .compact()
    .value();

  /* Mount to the specified paths */
  for (const p of paths) {
    const [method, uri] = p.split(/\s+/);

    /* Panic if either method or uri is falsy */
    if (!method || !uri) {
      throw new Error(`Invalid mount path: ${p}`);
    }

    /* Panic if method not supported */
    Debug(method, uri);

    /* check mounted method */
    const mount = self.app[method.toLowerCase()];

    /* if method is not mounted, throw error*/
    if (!mount) {
      throw new Error(`Method not supported: ${method}`);
    }

    /* Mount the middleware stack */
    mount.call(self.app, uri, ...stack);
  }
}

module.exports = endpoint;
