/**
 * types/localized.js
 */

module.exports = function (schematik) {
  schematik.typedef("localized", (s) =>
    s

      /* Require Simplified Chinese, Traditional Chinese and English locales */
      .property("zh-CN", schematik.string().with.min.length(1))
      .property("zh-HK", schematik.string().with.min.length(1))
      .property("en-US", schematik.string().with.min.length(1))

      /* Optionally allow other locales */
      .pattern.property(
        /^[a-z]{2,3}(?:-[A-Z]{2,3}(?:-[a-zA-Z]{4})?)?$/,
        schematik.string().with.min.length(1)
      )

      /* Require at least one locale */
      .and.min.count(1)
      .and.no.more.properties()
  );
};
