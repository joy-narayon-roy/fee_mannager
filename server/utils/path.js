const path = require("path");

function getPublicPath() {
  // When running inside pkg
  if (process.pkg) {
    // return path.join(process.cwd(), "public");
    return process.pkg.path.resolve('public')
  }

  // Normal node run
  return path.join(__dirname, "..", "public");
}

module.exports = { getPublicPath };
