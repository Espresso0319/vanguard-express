/**
 * private/load-actions.js
 */

/**
 * load actions
 */
function load(prefix, actions) {
  /* check array actions */
  if (Array.isArray(actions)) {
    this.action(prefix, actions);
  } else {
    for (const key of Object.keys(actions)) {
      let p = prefix;

      if (!p) {
        p = key;
      } else if (key !== "$") {
        p = `${p}:${key}`;
      }

      this.load(p, actions[key]);
    }
  }
}

module.exports = load;
