const studentController = require("./student");
const feeController = require("./fee");
const paymentController = require("./payment");
const scheduleController = require("./schedule");

function notFoundController(req, res, next) {
  return res.status(404).json({
    message: "Not found!",
  });
}

function healthController(req, res, next) {
  return res.status(200).json({
    message: "Good",
  });
}

function defaultController(req, res, next) {
  return res.status(200).json({
    message: "This is default hendler.",
  });
}
module.exports = {
  notFoundController,
  healthController,
  defaultController,
  student: studentController,
  fee: feeController,
  payment: paymentController,
  schedule: scheduleController,
};
