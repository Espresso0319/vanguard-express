/**
 * private/check-role.js
 */
const _ = require("lodash");

/**
 * check role
 */
function check(ent, role, { user }) {
  /* Deny if not logged in */
  if (!user) {
    return false;
  }

  /* Deny if not a staff member */
  if (user.type !== "staff") {
    return false;
  }

  /* Deny if role is scoped but no entity found */
  if (role.scope && !ent) {
    return false;
  }

  /* Search user roles for the role/scope combination */
  const match = _.chain(user.roles)
    .some((i) => {
      /* Skip roles with non-matching names */
      if (i.name.toLowerCase() !== role.qualified.toLowerCase()) {
        return false;
      }

      /* Match global roles */
      if (!role.scope || role.scope === "ricepo") {
        return true;
      }

      /* Skip roles with non-matching scopes */
      if (i.scope && i.scope !== ent._id.toString()) {
        return false;
      }

      return true;
    })
    .value();

  return !!match;
}

module.exports = check;
