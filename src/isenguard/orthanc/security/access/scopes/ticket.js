/**
 * security/access/scopes/ticket.js
 */

/**
 * Ticket face control
 */
function ticket(fc) {
  /**
   * ticket_id -> ticket
   */
  fc.scope("ticket", { hint: "ticket_id" }, (req) =>
    /* Find ticket */
    this.actAsync("ns:ticket,role:data,cmd:find", { id: req.params.ticket_id })
  );
}

module.exports = ticket;
