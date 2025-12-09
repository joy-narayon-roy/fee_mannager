const { Student } = require("../models");

async function createFees() {
  try {
    const students = await Student.find();
    console.log(students);
  } catch (err) {
    console.log(err);
  }
}

module.exports = createFees;
