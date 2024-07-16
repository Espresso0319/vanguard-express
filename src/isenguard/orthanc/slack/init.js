/**
 * server/init.js
 */
const { WebClient } = require("@slack/web-api");

module.exports = (options) =>
  async function init() {
    /* slack */
    const token = options.token;

    const slackClient = new WebClient(token);

    this.set("slack.client", slackClient);
  };
