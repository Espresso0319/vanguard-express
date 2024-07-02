/**
 * middleware/access.js
 */

/**
 * authorization access middleware
 */
function access(options) {
  /* if access config is not bided in options, return null */
  if (!options.access) {
    return null;
  }

  /* Convert options to an explicit array */
  const args = [].concat(options.access);

  return this.access(...args);
}

module.exports = access;
