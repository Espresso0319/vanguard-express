/**
 * util/uid.js
 */
const ShortId = require("shortid");
const ObjectId = require("bson-objectid");
const _ = require("lodash");

/**
 * Export stuff
 */
module.exports = {
  generate,
  canon,
  isSame,
};

/**
 * Regex pattern for valid IDs
 */
const pattern = /^([a-zA-Z0-9]+)_([a-zA-Z0-9$@_-]+)$/;

/**
 * ID generation
 */
function generate(prefix) {
  /* Generate short ID */
  const uid = ShortId.generate();

  /* Refuse to generate unprefixed IDs */
  if (typeof prefix !== "string") {
    throw new Error("ID generation requires a string prefix");
  }

  return `${prefix}_${uid}`;
}

/**
 * ID canon idolization
 */
function canon(v) {
  /* When v is falsy, return null */
  if (!v) {
    return null;
  }

  /* If this is a BSON ObjectId, deserialize it */
  if (ObjectId.isValid(v)) {
    return ObjectId(v);
  }

  /* Check if this is a valid string ID */
  const match = pattern.exec(v);

  /* if not valid, throw error */
  if (!match || !ShortId.isValid(match[2])) {
    throw new Error("Attempting to convert an invalid ID");
  }

  return v;
}

/**
 * Compare whether the ids are the same
 */
function isSame(id1, id2) {
  return _.toString(id1) === _.toString(id2);
}
