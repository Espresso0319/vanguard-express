/**
 * security/access/scopes/region.js
 */

/**
 * Region face control
 */
function region(fc) {
  /**
   * region_id -> region
   */
  fc.scope("region", { hint: "region_id" }, async (req) =>
    /* Find region */
    this.actAsync("ns:region,role:data,cmd:find", { id: req.params.region_id })
  );

  /**
   * rest_id -> restaurant -> region
   */
  fc.scope(
    "region",
    {
      hint: "rest_id",
      deps: "restaurant",
    },
    (req) =>
      /* Find region */
      this.actAsync("ns:region,role:data,cmd:find", {
        id: req.$fc_cache$.restaurant.region._id,
      })
  );

  /**
   * order_id -> order -> region
   */
  fc.scope(
    "region",
    {
      hint: "order_id",
      deps: "order",
    },
    (req) =>
      /* Find region */
      this.actAsync("ns:region,role:data,cmd:find", {
        id: req.$fc_cache$.order.region._id,
      })
  );
}

module.exports = region;
