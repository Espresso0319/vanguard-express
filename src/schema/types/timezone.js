/**
 * types/timezone.js
 */

module.exports = function (schematik) {
  schematik.typedef("timezone", schematik.String, (s) =>
    s.that.matches(/^\w+\/\w+$/)
  );
};
