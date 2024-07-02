/**
 * middleware/user-agent.js
 */
const _ = require("lodash");
const Debug = require("debug")("vg:mw:user-agent");
const Semver = require("semver");
const OhShit = require("oh-shit");

/**
 * HTTP headers that will be checked for UA information, in the order
 */
const headers = ["X-Ricepo-Client", "User-Agent"];

/**
 * Known clients
 */
const known = new Set(["ricepo", "connect"]);

/**
 * Version string Regex
 */
const regex = /^([\w-_]+)\/([\w.]+(?:-[\w]+)?)/;

/**
 * Determines connecting client application and version;
 * also gates the application based on endpoint config.
 */
module.exports = ({ gate = {} }) =>
  function ua(req, res, next) {
    const raw = _.chain(headers)
      .map((i) => req.get(i))
      .find()
      .value();

    /* Attempt to parse the header in question; default to Unknown/1.0.0 */
    const matches = regex.exec(raw);
    const client = {
      app: "unknown",
      version: "1.0.0",
      known: false,
    };

    /* match client app and client version */
    if (matches) {
      client.app = matches[1];
      client.version = matches[2];
    }

    /* App name should be lowercase */
    client.app = client.app.toLowerCase();

    /* Also record the IP address here */
    client.ip =
      req.headers["x-ricepo-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress;

    client.language = req.headers["x-ricepo-lang"];

    /* Also record the device id from header */
    client.device = req.headers["x-ricepo-device"];

    /* Semver compatibility: convert X.X into X.X.0 */
    if (/^\d+\.\d+$/.test(client.version)) {
      client.version = `${client.version}.0`;
    }

    /* Attach the resulting info object to request */
    req.ua = client;
    Debug(client);

    /* Only gate ricepo app */
    if (!known.has(client.app)) {
      return next();
    }

    /* At this point, mark the client as known */
    req.ua.known = true;

    /* Reject invalid versions */
    if (!Semver.valid(client.version)) {
      throw OhShit("invalid-version", { ua: client });
    }

    /* If gate option is set, gate clients based on the version */
    if (!Semver.satisfies(client.version, gate[client.app] || "*")) {
      throw OhShit("update-required", { ua: client });
    }

    return next();
  };
