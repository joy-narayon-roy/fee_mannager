const { Router } = require("express");
const path = require("path");
const controller = require("../controllers");
const student_routes = require("./student.routes");
const fee_routes = require("./fee.routes");
const payment_routes = require("./payment.routes");
const schedule_routes = require("./schedule.routes");
const profile_routes = require("./profile.routes");

const router = Router();
const api_router = Router();

api_router.get("/", (_req, res, _next) =>
  res.status(200).json({ message: "This is api route" })
);

api_router.use("/student", student_routes);
api_router.use("/fee", fee_routes);
api_router.use("/payment", payment_routes);
api_router.use("/schedule", schedule_routes);
api_router.use("/profile", profile_routes);

router.use("/api", api_router);
router.get("/health", controller.healthController);

router.use((_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
