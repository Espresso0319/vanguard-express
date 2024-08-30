/**
 * types/address.js
 */

module.exports = function (schematik) {
  schematik.typedef("address", (s) =>
    s

      /* Optional Address Components */
      .property("unit", schematik.optional.string())
      .property("note", schematik.optional.string())
      .property("number", schematik.optional.string())
      .property("street", schematik.optional.string())
      .property("city", schematik.optional.nullable.string())

      /* Required Address Components */
      .property("state", schematik.string())
      .property("country", schematik.string().matches(/^[A-Z]{2}$/))
      .property("zipcode", schematik.optional.nullable.string())
      .property("formatted", schematik.string())
      .property(
        "location",
        schematik
          .object()
          .property("type", schematik.string().enum("Point"))
          .property(
            "coordinates",
            schematik
              .array()
              .items(
                schematik.number().range(-180, +180),
                schematik.number().range(-90, +90)
              )
              .length(2)
          )
      )
      .no.more.properties()
  );
};
