require("dotenv").config({
  quiet: true,
});
const config = require("./config");
const createFees = require("./services/createFees");
async function main() {
  try {
    const dbConnection = await config.connectDB(process.env.MONGODB_URI);
    await createFees();
    await dbConnection.connection.close();
  } catch (err) {
    console.log(err);
  }
}
main();
