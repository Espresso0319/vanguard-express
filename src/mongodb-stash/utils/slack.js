const _             = require('lodash');

/**
 * Send slack message
 * @param {Object} message
 * @param {Array|String} tagPeople - People who will be at in slack
 * @param {String} channel - The slack channel which will receive the message
 */
async function send(stash, { message, tagPeople = [], channel }) {


  /* Get slack client */
  const app = stash.slack;


  const tagList = [].concat(tagPeople);

  /* Get uesrs of slack */
  const members = await app.paginate(
    'users.list', { limit: 100 },
    () => {},
    (acc, page) => (acc || []).concat(page.members)
  );

  /**
   * Generate tag string
   * <@userID>
   */
  const tagStr = _
    .chain(members)
    .filter(m => _.includes(tagList, m.real_name))
    .map(member => member.id)
    .reduce((acc, cur) => `${acc} <@${cur}>`, '')
    .value();

  const content = `${tagStr}\n${message}`;

  /* Send message to slack */
  await app.chat.postMessage({
    channel,
    text: content
  });

}

module.exports.send = send;
