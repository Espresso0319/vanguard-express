/**
 * server/decorators/factory.js
 */
const Debug = require("debug")("orthanc:server:factory");

/**
 *  server factory decorator
 */
function factory(fn) {
  /* Debug Seneca */
  Debug(fn.name);

  /* Push decorated functions to server factories */
  this.get("server.factories").push(fn);
}

module.exports = factory;
