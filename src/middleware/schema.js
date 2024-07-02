/**
 * middleware/schema.js
 */
const _ = require("lodash");
const Ajv = require("ajv");
const OhShit = require("oh-shit");

/**
 * Vanilla validator
 */
const Vanilla = Ajv({ allErrors: true });
const Coerce = Ajv({ allErrors: true, coerceTypes: true });

/**
 * schema middleware
 */
function schema(options) {
  if (!options.schema) {
    return null;
  }

  /**
   * Coerce options
   */
  const coerce = options.schema.coerce$ || { query: true };

  /* delete coerce */
  delete options.schema.coerce$;

  /**
   * Compile the schema into a validation function
   */
  const validator = _.chain(options.schema)
    .mapValues((i) => (typeof i.done === "function" ? i.done() : i))
    .mapValues((i, k) => (coerce[k] ? Coerce.compile(i) : Vanilla.compile(i)))
    .value();

  /**
   * The actual middleware function
   */
  return (req, res, next) => {
    const results = {};

    /* Iterate validator */
    for (const k of Object.keys(validator)) {
      /* Prepare validator */
      const validate = validator[k];
      const valid = validate(req[k]);

      /* if not valid, add validation error */
      if (!valid) {
        results[k] = _.chain([].concat(validate.errors))
          .map((i) => ({ path: i.dataPath, message: i.message }))
          .value();
      }
    }

    /* throw error */
    if (Object.keys(results).length > 0) {
      next(OhShit(400, { errors: results }));
    } else {
      next();
    }
  };
}

module.exports = schema;
