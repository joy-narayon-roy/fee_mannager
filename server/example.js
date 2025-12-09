require("dotenv").config({
  path: "./.env.local",
  quiet: true,
});
const { format, differenceInMonths } = require("date-fns");
const config = require("./src/config");
const models = require("./src/models");

async function createStudent() {
  const student = new models.Student({
    name: "Test",
    fee: 1000,
    class: 5,
  });

  return await student.save();
}
async function findStudents() {
  const student = await models.Student.findById(
    "69312c038d675e5f20ff36b3"
  ).populate("schedules");
  console.log(student);
}

async function findThenUpdate(id = "692ff5a364264d186e175a9b") {
  const student = await models.Student.findById(id);
  // student.set("status", "Inactive");
  // student.set("start_date", "2025-05-01");
  // await student.save();

  console.log(student);
  console.log(
    format(student.start_date, "dd/MM/yy"),
    "->",
    format(student.end_date, "dd/MM/yy")
  );
  console.log(differenceInMonths(student.end_date, student.start_date));
  console.log();
}

async function createFee() {
  const fee = new models.Fee({
    student: "692ff5a364264d186e175a9b",
    // total_amount: 1000,
    // amount_due: 1000,
    month: 12,
    // year: 2025,
  });

  await fee.save();
  console.log(fee);
}

async function createPayment() {
  console.log(
    await models.Payment.payRemainingDues("692ff5a364264d186e175a9b", 500)
  );
}

async function createSchedule() {
  const sid = '69312c038d675e5f20ff36b3'
  const sch = new models.Schedule({
    is_active:true,
    days:[{
      day:"sat",
      start_time:'2:00 PM',
      end_time:'3:30 PM'
    },{
      day:"mon",
      start_time:'2:00 PM',
      end_time:'3:30 PM'
    },{
      day:"thu",
      start_time:'2:00 PM',
      end_time:'3:30 PM'
    },],
    name:"TR6",
    _assignToStudents:[sid]
  })
  console.log(await sch.save())
}

async function main() {
  try {
    const conn = await config.connectDB();
    try {
      // const students = await models.Student.find().populate('fees')
      // console.log(await createStudent())
      // findStudents();
      
      // console.log(students.toString())
      // console.log(await createStudent())
      // await createFee();
      // await createPayment()
      await createSchedule()
    } catch (err) {
      throw err;
    } finally {
      conn.disconnect();
    }
  } catch (err) {
    console.log(err);
  }
}

main();
