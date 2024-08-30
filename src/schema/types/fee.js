/**
 * types/fee.js
 */

module.exports = function (schematik) {
  schematik.typedef("fee", (s) =>
    s
      .property("flat", schematik.integer().with.min.of(0))
      .property("factor", schematik.number().in.range.of(0, 1))
      .and.no.more.properties()
  );
};
