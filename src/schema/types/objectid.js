/**
 * types/objectid.js
 */

module.exports = function (schematik) {
  schematik.typedef("objectId", schematik.String, (s) =>
    s.that.matches(/^([A-Fa-f\d]{24})|(([a-zA-Z0-9]+)_([a-zA-Z0-9$@_-]+))$/)
  );
};
