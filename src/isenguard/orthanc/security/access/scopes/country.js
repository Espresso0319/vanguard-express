/**
 * security/access/scopes/country.js
 *
 * @author  lan <lan.shen@rice.rocks>
 * @license 2022 (C) RICE Technologies Limited. All Rights Reserved
 */

/**
 * country face control
 */
function country(fc) {

  /**
   * country_id -> country
   */
  fc.scope(
    'country',
    { hint: 'country_id' },
    async req =>

    /* Find country */
      this.actAsync(
        'ns:country,role:data,cmd:find',
        { id: req.params.country_id }
      )
  );

  /**
   * region_id -> region -> country
   */
  fc.scope('country', { hint: 'region_id', deps: 'region' }, req => {

    /* Find region */
    this.actAsync('ns:country,role:data,cmd:find', { id: req.$fc_cache$.region.country._id });
  });
}

module.exports = country;
