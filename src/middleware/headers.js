/* -------------------------------------------------------------------------- */
/*                                                                            */
/* Set application-level default response headers here.                       */
/*                                                                            */
/* -------------------------------------------------------------------------- */
const pkg          = require('../../package.json');


module.exports =  function headers(req, res, next) {

  /* Replace the default X-Powered-By header with our own */
  res.setHeader('X-Powered-By', `Vanguard/${pkg.version} (${pkg.commit})`);

  /* jump to next middleware */
  next();
};
