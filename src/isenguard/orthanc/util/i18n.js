/**
 * utils/i18n.js
 */
const _ = require("lodash");

/**
 * Export stuff
 */
module.exports = {
  getCurrencyCode,
  getCurrencyTranslation,
  getCurrency,
  getCountryByPhone,
};

const currencyMap = {
  US: "USD",
  ES: "EUR",
  FR: "EUR",
  GB: "GBP",
  IE: "EUR",
};

const map = {
  UK: { code: "GBP", sign: "£" },
  ES: { code: "EUR", sign: "€" },
  CT: { code: "EUR", sign: "€" },
  US: { code: "USD", sign: "$" },
};

/**
 * Get currency code based on country
 */
function getCurrency({ country, region }) {
  /* Use EUR by default */
  if (_.isNil(country) && _.isNil(region)) {
    return { code: "EUR", sign: "£" };
  }

  const res = _.get(map, "ES");

  if (country) {
    return _.get(map, _.upperCase(country), res);
  }

  const regionName = _.chain(region)
    .split(",")
    .get("1", "ES")
    .upperCase()
    .value();

  return _.get(map, regionName, res);
}

/**
 * Get currency code based on country
 */
function getCurrencyCode({ country = "ES" }) {
  /* Use EUR by default */
  if (_.isNil(country)) {
    return "EUR";
  }

  return _.get(currencyMap, country, "EUR");
}

/**
 * Get currency code based on country
 */
function getCurrencyTranslation({ country = "ES" }) {
  /* usd */
  if (/US/.test(country)) {
    return "$";
  }

  /* gbp */
  if (/GB/.test(country)) {
    return "£";
  }

  /* eur */
  return "€";
}

/**
 * Get country from phone number
 */
function getCountryByPhone(phone = "") {
  /* China */
  if (/\+86/.test(phone)) {
    return "CN";
  }

  /* France */
  if (/\+33/.test(phone)) {
    return "FR";
  }

  /* Spain */
  if (/\+34/.test(phone)) {
    return "ES";
  }

  /* UK */
  if (/\+44/.test(phone)) {
    return "GB";
  }

  /* XXX old 9 digit format for spain  */
  if (phone.length === 9) {
    return "ES";
  }

  return "GB";
}
