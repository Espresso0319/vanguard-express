module.exports = function(schematik) {

  schematik.typedef('chinese', schematik.String, s =>
    /*
     * Chinese Chars + English Chars + Latin Chars
     * digits + space + $%・.
     */
    s.that.matches(/^[\u4e00-\u9fa5A-Za-zÀ-ÿ\d\s$%・\.の@']*$/)
  );

};
