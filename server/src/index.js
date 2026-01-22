const dotenv = require("dotenv");
// const yargs = require("yargs/yargs");
// const { hideBin } = require("yargs/helpers");
const config = require("./config");
const server = require("./server");
// const argv = yargs(hideBin(process.argv)).option("env_path", {
//   alias: "cp",
//   type: "string",
//   default: ".env",
//   description: "Environment variables file(.env) path",
// }).argv;
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
    server.listen(PORT);
  })
  .catch((err) => {
    console.log(`DB: ${process.env.MONGODB_URI} (Failed!)`);
    console.log(err);
  });
