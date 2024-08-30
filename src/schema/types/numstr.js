/**
 * types/numstr.js
 */

module.exports = function (schematik) {
  schematik.typedef("numString", schematik.String, (s) =>
    s.that.matches(/^\d+$/)
  );
};
