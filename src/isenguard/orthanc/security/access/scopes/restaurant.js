/**
 * security/access/scopes/restaurant.js
 */

/**
 * Restaurant face control
 */
function restaurant(fc) {
  /**
   * rest_id -> restaurant
   */
  fc.scope("restaurant", { hint: "rest_id" }, (req) =>
    /* Find restaurant */
    this.actAsync("ns:restaurant,role:data,cmd:find", {
      id: req.params.rest_id,
    })
  );

  /**
   * order_id -> order -> restaurant
   */
  fc.scope(
    "restaurant",
    {
      hint: "order_id",
      deps: "order",
    },
    (req) =>
      /* Find restaurant */
      this.actAsync("ns:restaurant,role:data,cmd:find", {
        id: req.$fc_cache$.order.restaurant._id,
      })
  );
}

module.exports = restaurant;
