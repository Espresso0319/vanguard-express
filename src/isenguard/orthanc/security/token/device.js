/**
 * security/token/device.js
 */

/**
 * Device token
 */
async function device() {
  /* Sign JWT to device */
  const signed = await this.actAsync("ns:crypto,role:jwt,cmd:sign", {
    payload: { sub: null },
    type: "device",
    permanent: true,
  });

  return signed;
}

module.exports = device;
