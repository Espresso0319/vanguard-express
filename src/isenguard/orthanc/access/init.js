/**
 * access/index.js
 */
const check = require("./private/check-role");

module.exports = (options) =>
  /**
   * Initialize Role Check
   */
  async function init() {
    /**
     * Default options
     */
    options = Object.assign(
      {
        roles: [],
        imply: {},
      },
      options
    );

    /**
     * Load builtin roles
     */
    this.access.role("anyone", () => true);
    this.access.role(
      "staff",
      (ent, role, req) => req.user && req.user.type === "staff"
    );

    /**
     * Load common roles
     */
    for (const role of options.roles) {
      this.access.role(role, check);
    }

    /**
     * Load implications
     */
    for (const role of Object.keys(options.imply)) {
      this.access.imply(role, options.imply[role]);
    }
  };
