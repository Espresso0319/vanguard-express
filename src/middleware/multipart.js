/**
 * middleware/multipart.js
 */
const Multer = require("multer")();

/**
 * Factory function
 */
function multipart(options) {
  if (!options.multipart) {
    return null;
  }

  /* If file field is present use that field name to upload
   * Note: Max count of files to get uploaded at time
   */
  if (options.file) {
    return Multer.array(options.file, 5);
  }

  return Multer.fields([]);
}

/**
 * Exports
 */
module.exports = multipart;
