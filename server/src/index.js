const dotenv = require("dotenv");
const config = require("./config");
const server = require("./server");
const { default: mongoose } = require("mongoose");

dotenv.config({
  path: ".env",
  quiet: true,
});

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
let DB_CONNECTION = null;

config
  .connectDB(MONGODB_URI)
  .then(async (dbConn) => {
    DB_CONNECTION = dbConn;
    console.log(`DB Connected`);
    console.log("DB Host :", mongoose.connection.host);
    console.log("DB Name :", mongoose.connection.db.databaseName);
    server.listen(PORT);
  })
  .catch((err) => {
    console.log(`DB: ${process.env.MONGODB_URI} (Failed!)`);
    console.log(err);
  });
