/**
 * security/access/scopes/customer.js
 */

/**
 * Customer face control
 */
function customer(fc) {
  /**
   * customer_id -> customer
   */
  fc.scope("customer", { hint: "customer_id" }, async (req) =>
    /* Find customer */
    this.actAsync("ns:customer,role:data,cmd:find", {
      id: req.params.customer_id,
    })
  );

  /**
   * order_id -> customer
   */
  fc.scope(
    "customer",
    {
      hint: "order_id",
      deps: "order",
    },
    async (req) =>
      /* Find customer */
      this.actAsync("ns:customer,role:data,cmd:find", {
        id: req.$fc_cache$.order.customer._id,
      })
  );
}

module.exports = customer;
