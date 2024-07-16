const _    = require('lodash');
const util = require('./decorators/util');


/**
 * Redis package initialization
 */
async function redis(options) {


  /**
   * Module initialization
   */
  this.addAsync('init:redis', require('./init')(options));
  this.addAsync('ns:util,role:data,cmd:upsert', require('./data/upsert'));
  this.addAsync('ns:util,role:data,cmd:find', require('./data/find'));

  /**
   * Decorators
   */
  this.decorate('redis', _.mapValues(util, (v) => _.bind(v, this)));

}

module.exports = redis;
