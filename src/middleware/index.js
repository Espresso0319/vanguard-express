/**
 * middleware/index.js
 */

/**
 * middleware index
 */
function middleware() {
  this.addAsync("init:middleware", async function () {
    this.factory(require("./user-agent"));
    this.factory(require("./params"));
    this.factory(require("./auth"));
    this.factory(require("./access"));
    this.factory(require("./conditional"));
    this.factory(require("./multipart"));
    this.factory(require("./schema"));
    this.factory(require("./paging"));
    this.factory(require("./handler"));
    this.factory(require("./error"));
  });
}

module.exports = middleware;
