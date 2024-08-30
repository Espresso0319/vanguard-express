/**
 * types/identifier.js
 */

module.exports = function (schematik) {
  schematik.typedef("identifier", schematik.String, (s) =>
    s.that.matches(/^[$A-Za-z_][0-9A-Za-z_$]*$/)
  );
};
