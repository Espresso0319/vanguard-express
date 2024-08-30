module.exports = function(schematik) {

  schematik.typedef('english', schematik.String, s =>
    /*
     * English Chars + Latin Chars
     * digits + space + $%・. + '&-
     */
    s.that.matches(/^[A-Za-zÀ-ÿ\d\s$%・\.'&-の@]*$/)
  );

};
