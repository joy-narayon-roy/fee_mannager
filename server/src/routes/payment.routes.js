const { Router } = require("express");
const controller = require("../controllers");
const router = Router();

router.get("/", controller.payment.getPayments);
router.get("/:id", controller.payment.getPaymentById);
router.post("/", controller.payment.createPayment);

module.exports = router;
