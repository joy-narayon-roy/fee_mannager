const { getPublicPath } = require("./publicPath");

function createError(msg = "Some error occurs", code = 400) {
  const err = new Error(msg);
  err.httpStatus = code;
  return err;
}
function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = { createError, capitalizeFirst, getPublicPath };
