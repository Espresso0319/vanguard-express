/**
 * data/update.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license 2015-16 (C) Ricepo LLC. All Rights Reserved.
 */
const _            = require('lodash');

/**
 * Update accoutns
 */
async function update(args) {

  /* Get accounts collection */
  const stash = this.collection('accounts');
  const data = args.data || { };
  const options = args.options || { };

  /**
   * Push APN
   */
  if (args.apn) {
    const apns = _(args.apn)
      .concat()
      .compact()
      .slice(-3)
      .value();

    /* save apn */
    _.set(data, '$set.apn', apns);
  }

  /* add lcoation updatedat when update location */
  if (_.get(args, 'data.$set.location')) {

    _.set(data, '$set.locationUpdatedAt', new Date());
  }

  /**
   * UpdatedAt flag
   */
  _.set(data, '$set.updatedAt', new Date());

  const account = await stash.updateOne(args.id, data, options);

  /**
   *  send message to SQS when account changed only driver send
   */

  if (_.some(account.roles, { name: 'region.driver' })) {
    this.actAsync('ns:account,role:sqs,cmd:send', { account, type: 'tron-map' });
  }

  return account;
}

module.exports = update;
