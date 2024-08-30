/**
 * types/color.js
 *
 * @desc    Hex color string
 */

module.exports = function (schematik) {
  schematik.typedef("color", schematik.String, (s) =>
    s.that.matches(/^#?[0-9A-Fa-f]{6}$/)
  );
};
