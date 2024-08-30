/**
 * types/range.js
 */

module.exports = function (schematik) {
  schematik.typedef("range", (s) =>
    s.property("min", schematik.number()).property("max", schematik.number())
  );
};
