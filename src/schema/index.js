/**
 * index.js
 *
 * @desc    Valid JS identifier
 */

module.exports = function (s) {
  s.use(require("./types/color"));
  s.use(require("./types/datetime"));
  s.use(require("./types/fee"));
  s.use(require("./types/identifier"));
  s.use(require("./types/localized"));
  s.use(require("./types/numstr"));
  s.use(require("./types/objectid"));
  s.use(require("./types/point"));
  s.use(require("./types/range"));
  s.use(require("./types/timezone"));
  s.use(require("./types/zipcode"));
  s.use(require("./types/address"));
  s.use(require("./types/chinese"));
  s.use(require("./types/english"));
};
