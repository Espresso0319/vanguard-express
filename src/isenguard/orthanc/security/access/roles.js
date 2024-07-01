/**
 * security/access/roles.js
 */
const _ = require("lodash");

/**
 * Special roles face control
 */
function roles(fc, options) {
  /**
   * Special role: customer.self
   */
  fc.role("customer.self", (ent, role, req) => {
    /* of no user, return false */
    if (!ent || !req.user) {
      return false;
    }

    /* If user is not self, Unauthorized */
    if (req.user.type !== "customer") {
      return false;
    }

    return ent._id.toString() === req.user._id.toString();
  });

  /**
   * Special role: ticket.assignee
   */
  fc.role("ticket.assignee", (ent, role, req) => {
    /* If there is no user, unauthorized */
    if (!ent || !req.user) {
      return false;
    }

    /* If user is not staff, Unauthorized */
    if (req.user.type !== "staff") {
      return false;
    }

    /* Get ticket assignee */
    const uid = req.user._id.toString();

    /* Get if req.user is in ticket.assignee */
    const inAssignee = !!_.some(ent.assignee, (i) => i._id.toString() === uid);

    /* Get if req.user is in ticket.assignees */
    const inAssignees = !!_.some(
      ent.assignees,
      (i) => i._id.toString() === uid
    );

    /* Format ticket.groups */
    const formatGroup = _.map(ent.groups, (group) => ({
      name: group.name,
      scope: group.scope ? group.scope.toString() : null,
    }));

    /* Format req.user.roles */
    const formatRoles = _.map(req.user.roles, (r) => ({
      name: r.name,
      scope: r.scope ? r.scope.toString() : null,
    }));

    /* Get if req.user.roles is in ticket.groups */
    const inGroups =
      _.intersectionWith(formatGroup, formatRoles, _.isEqual).length > 0;

    /* Pass if user in assignee or in groups or in assignees */
    return inAssignee || inGroups || inAssignees;
  });
}

module.exports = roles;
