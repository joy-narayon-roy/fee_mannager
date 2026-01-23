const path = require("path");

function getPublicPath() {
  // Works both in dev & pkg
  return path.join(__dirname, "..", "public");
}

module.exports = { getPublicPath };
