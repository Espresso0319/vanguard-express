/**
 * security/access/actions.js
 */
const _ = require("lodash");

/**
 * Access Actions
 */
function actions(fc, options) {
  /**
   * Function that will recursively add actions from the tree
   */
  function addAction(path, data) {
    /* Recursively iterate data */
    if (_.isArray(data)) {
      fc.action(path, data);
    } else {
      _.forEach(data, (v, k) => {
        /* Assign path */
        let p = path;

        /* Parse */
        if (k !== "$") {
          p = `${p}:${k}`;
        }

        /* Recursive call */
        addAction(p, v);
      });
    }
  }

  /**
   * Add all actions from option root
   */
  _.forEach(options.actions, (v, k) => addAction(k, v));
}

module.exports = actions;
