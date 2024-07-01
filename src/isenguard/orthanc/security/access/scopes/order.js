/**
 * security/access/scopes/order.js
 */

/**
 * Order face control
 */
function order(fc) {
  /**
   * order_id -> order
   */
  fc.scope("order", { hint: "order_id" }, (req) =>
    /* Find order */
    this.actAsync("ns:order,role:data,cmd:find", { id: req.params.order_id })
  );
}

module.exports = order;
