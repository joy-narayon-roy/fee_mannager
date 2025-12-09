// src/config/db.js
const mongoose = require("mongoose");

/**
 *
 * @param {string} MONGODB_URI
 * @returns {Promise<mongoose>}
 */
const connectDB = async (MONGODB_URI) => {
  const conn = await mongoose.connect(MONGODB_URI || process.env.MONGODB_URI, {
    dbName: "fee_mannager",
    // These options are now default in Mongoose 6+, but good to keep
    // useNewUrlParser: true,    // deprecated
    // useUnifiedTopology: true, // deprecated
  });
  return conn;
};

module.exports = connectDB;
