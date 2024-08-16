/**
 * api/auth/token.js
 */
const Schematik = require("schematik");

/**
 * Validation schema
 */
const types = ["customer"];

const body = Schematik.object()
  .property("phone", Schematik.string().matches(/^\+?\d{9,15}$/))
  .property("type", Schematik.string().enum(...types))
  .and.no.more.properties()
  .done();

/**
 * Endpoint metadata
 */
exports.path = "POST /v1/auth/sign";
exports.auth = null;
exports.schema = { body };
exports.handler = create;
exports.limit = { max: 20 };

/**
 * Request handler function
 */
async function create(req) {
  const { phone, type } = req.body;

  /* Sign JWT to customer expire token in 7 days */
  const { token } = await this.actAsync("ns:crypto,role:jwt,cmd:sign", {
    payload: { phone },
    type,
    expiresIn: 10,
  });

  return { sig: token };
}
