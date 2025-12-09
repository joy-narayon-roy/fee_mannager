// index.js
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
  .option("env_path", {
    alias: "cp",
    type: "string",
    default:".env",
    description: "Environment variables file(.env) path",
  
  }).argv;

console.log("User ID:", argv.env_path);
