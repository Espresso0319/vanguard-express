/**
 * types/point.js
 */

module.exports = function (schematik) {
  /**
   * Point in its JSON Object form
   */
  schematik.typedef("geolocation", (s) =>
    s
      .property("lat", schematik.number().in.range.of(-90, 90))
      .property("lon", schematik.number().in.range.of(-180, 180))
      .and.no.more.properties()
  );

  /**
   * Point in its string form
   */
  schematik.typedef("locationString", schematik.String, (s) =>
    s.that.matches(/^([+-]?[0-9]+(?:\.[0-9]+|)),([+-]?[0-9]+(?:\.[0-9]+|))$/)
  );
};
