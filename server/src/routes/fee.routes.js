const express = require("express");
const controller = require("../controllers");
const router = express.Router();

router.get("/", controller.fee.getFees);
router.get("/:id", controller.fee.getFeeById);
router.post("/bulk", controller.fee.createFeeBulk);
router.post("/", controller.fee.createFee);
router.patch("/:id", controller.fee.updateFee);
router.delete("/:id", controller.fee.deleteFee);

module.exports = router;
