const express = require("express");
const controller = require("../controllers");
const router = express.Router();

router.get("/", controller.profile.getProfile);
router.post("/", controller.profile.createProfile);
router.patch("/:id", controller.profile.updateProfile);
router.patch("/:id", controller.profile.addOrRemoveProfileID);

module.exports = router;
