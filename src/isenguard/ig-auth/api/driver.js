/* eslint-disable max-len */
/**
 * api/auth/driver.js
 *
 * @author  Leo <lixiang@ricepo.com>
 * @license 2020-21 (C) Ricepo LLC. All Rights Reserved.
 */
const OhShit = require("oh-shit");
const Schematik = require("schematik");
const _ = require("lodash");
const Bluebird = require("bluebird");
const Bcrypt = require("bcrypt-nodejs");

/**
 * Validation schema.
 */
const body = Schematik.object()
  .with /* XXX Backward compatible with non-E164 format, will restrict `+` */
  /* .property('phone',           Schematik.string().matches(/^\+1\d{9,15}$/)) */
  .property("phone", Schematik.string().matches(/^\+\d{9,15}$/))
  .property("vcode", Schematik.optional.numString())
  .and.no.more.properties()
  .done();

/**
 * Endpoint metadata
 */
exports.path = "POST /v1/auth/driver";
exports.schema = { body };
exports.auth = null;
exports.handler = login;
exports.limit = { max: 100 };

/**
 * Request handler function
 */
async function login(req, res) {
  const options = this.get("auth.options");
  const { verify, generate } = this.get("auth.vcode$");

  /* Twilio phone */
  const twilioOptions = this.get("twilio.options");
  const getCountry = this.get("util.getCountry");

  /* Get phone, vcode and method from body */
  let phone = req.body.phone;
  const { vcode } = req.body;

  /* Get carrier details from twilio */
  const carrier = await this.actAsync("ns:twilio,role:carrier,cmd:check", {
    phone,
  });

  /* Use E1.164 formatted phone number from twilio */
  phone = _.get(carrier, "phoneNumber") || req.body.phone;

  let account = await this.actAsync("ns:account,role:data,cmd:find", { phone });

  const data = {
    phone,
    type: "staff",
    passwd: await Bluebird.fromNode((done) =>
      Bcrypt.hash("12345678", null, null, done)
    ),
    roles: [
      {
        _id: this.uid.generate("role"),
        name: "region.driverCandidate",
      },
    ],
  };

  /* Check carrier type on registration */
  if (!account) {
    /**
     * if doesn't come from onboarding, throw err
     */
    if (_.get(req, "ua.app") !== "onboarding") {
      throw OhShit("Please register an account first.");
    }

    /* Check if carrier is VOIP */
    if (_.get(carrier, "carrier.type") === "voip") {
      throw OhShit(
        "Cell numbers from virtual operators cannot be used to register."
      );
    }

    if (_.get(carrier, "carrier.type") === "landline") {
      throw OhShit("This number cannot be used to register.");
    }

    /* Block the phone number with given carrier */
    if (_.includes(options.carrier, _.get(carrier, "carrier.name"))) {
      _.set(data, "voip", true);
    }

    /* create account */
    try {
      /* create account */
      account = await this.actAsync("ns:account,role:data,cmd:create", {
        data,
      });

      /* create onboarding */
      await this.actAsync("ns:onboarding,role:data,cmd:create", {
        data: {
          driver: {
            _id: account._id,
            phone,
          },
        },
      });
    } catch (err) {
      throw OhShit("account-data-create", {
        data: err,
        message: err.errmsg || err.message,
      });
    }
  }

  /**
   * Deny if account suspended
   */
  if (account.suspended) {
    throw OhShit("account-suspended", { skipSentry: true });
  }

  /**
   * If there is a vcode, verify it; otherwise create a new one
   */
  if (vcode) {
    return this::verify(account, vcode, "account");
  }

  /**
   * Refresh vcode if there is none, or if it is expired
   */
  const code = await this::generate(account, "account");

  /**
   * Deliver the vcode to account
   */
  try {
    await this.actAsync("ns:twilio,role:sms,cmd:create", {
      to: phone,
      body: `Your verification code is ${code}. Do not share it with anyone.`,
      test$: true,
      type: "login",
    });
  } catch (err) {
    /* It's wrapped by Seneca, use 'name' property */
    if (err.name === "21610") {
      const loginPhone = _.get(
        twilioOptions,
        `from.${getCountry(phone)}.login.phone`
      );

      /* tell account to send 'START' to twilio */
      throw OhShit(err.name, {
        data: err,
        message: `You have opted out of receiving SMS from RICE, so we can’t send you the 4 digit code. Please text ‘START’ to ${loginPhone} opt back in before continuing`,
      });
    } else {
      /* Panic if sms error */
      throw OhShit(err.name, {
        data: err,
        message: "Unexpected SMS error, please contact customer service.",
      });
    }
  }

  /* Get number of count for authentication. Set 0 if not found*/
  const count = _.get(account, "auth.count", 0);

  /* Do not allow if count is already reached 5*/
  if (count > 4 && count < 10) {
    /* Create ticket */
    this.act("ns:ticket,cmd:open", {
      targets: { name: "ricepo.deputy" },
      type: "fraud-alert-authCode",
      subject: `${account.phone} requested auth code [${code}] for ${count} times, please tell the account`,
      scope: { account: account._id },
    });
  }

  /* set status 202 */
  res.status(202);

  return {};
}
