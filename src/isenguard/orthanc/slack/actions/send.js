const _ = require("lodash");

/**
 * Send slack message
 * @param {Object} message
 * @param {Array|String} tagPeople - People who will be at in slack
 * @param {String} channel - The slack channel which will receive the message
 */
async function send({ message, tagPeople = [], channel }) {
  /* Get slack client */
  const app = this.get("slack.client");

  const tagList = [].concat(tagPeople);

  /* Get users of slack */
  const members = await app.paginate(
    "users.list",
    { limit: 100 },
    (page) => {},
    (acc, page, index) => (acc || []).concat(page.members)
  );

  /**
   * Generate tag string
   * <@userID>
   */
  const tagStr = _.chain(members)
    .filter((m) => _.includes(tagList, m.real_name))
    .map((member) => member.id)
    .reduce((acc, cur) => `${acc} <@${cur}>`, "")
    .value();

  const content = `${tagStr}\n${message}`;

  /* Send message to slack */
  await app.chat.postMessage({
    channel,
    text: content,
  });
}

module.exports = send;
