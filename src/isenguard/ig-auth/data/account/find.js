/**
 * data/find.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license 2015-16 (C) Ricepo LLC. All Rights Reserved.
 */

/**
 * Find account
 */
async function find(args) {

  /* get account collection */
  const stash = this.collection('accounts');
  const query = args.query || { };


  /**
   * If ID is specified, utilize cache
   */
  if (args.id) { return stash.findById(args.id); }


  /**
   * Special query parameters
   */
  if (args.email) {
    query.email = args.email;
  }

  if (args.phone) {
    query.phone = args.phone;
  }

  return stash.findOne(query);
}

module.exports = find;
