/**
 * types/datetime.js
 * @desc    Datetime in ISO 8601 format
 */

module.exports = function (schematik) {
  schematik.typedef("datetime", schematik.String, (s) =>
    s.that.matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/
    )
  );
};
