const { Router } = require("express");
const controller = require("../controllers");
const router = Router();

router.get("/", controller.schedule.getSchedules);
router.get("/:id", controller.schedule.getScheduleById);
router.post("/", controller.schedule.createSchedule);
router.patch("/:id", controller.schedule.updateSchedule);
router.delete("/:id", controller.schedule.deleteSchedule);
module.exports = router;
