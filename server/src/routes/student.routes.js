const express = require("express");
const controller = require("../controllers");
const router = express.Router();

router.get("/", controller.student.getStudents);
router.get("/:id", controller.student.getStudentById);
router.post("/", controller.student.createStudent);
router.patch("/:id", controller.student.updateStudent);
router.delete("/:id", controller.student.deleteByID);
module.exports = router;
