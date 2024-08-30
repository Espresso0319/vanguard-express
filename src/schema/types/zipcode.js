/**
 * types/zipcode.js
 */

module.exports = function (schematik) {
  schematik.typedef("zipcode", schematik.String, (s) =>
    s.that.matches(/^\d{5}$/)
  );
};
