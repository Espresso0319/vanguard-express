/**
 * middleware/precondition.js
 */
const OhShit = require("oh-shit");
const Moment = require("moment");

/**
 * conditional middleware
 */
function conditional({ cond }) {
  const opt = cond;

  /* if no option, return null */
  if (!opt) {
    return null;
  }

  return (req, res, next) => {
    const stash = this.collection(opt.stash);
    const id = req.params[opt.param];

    /* find stash */
    stash
      .findById(id, { fields: { updatedAt: true } })
      .then((ent) => {
        /**
         * Defer not-found handling to the handler
         */
        if (!ent) {
          return next();
        }

        /**
         * Grab the if-unmodified-since header
         */
        const ius = req.get("if-unmodified-since");

        /* if not jump to next */
        if (!ius) {
          return next();
        }

        /* get time of */
        const time = new Date(ius);

        /**
         * If updated since supplied time, fail
         */
        if (!ent.updatedAt) {
          return next();
        }

        /* get time diff */
        const delta = ent.updatedAt - time;

        /* if time diff is greater than 1s, throw error */
        if (delta >= 1000) {
          throw OhShit("precondition-failed", { id, skipSentry: true });
        }

        return next();
      })
      .catch(next);
  };
}

module.exports = conditional;
